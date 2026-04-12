import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import sendEmail from "../configs/nodeMailer.js";

// ✅ Create client
export const inngest = new Inngest({ id: "pingup-app" });


// 🔥 USER CREATE
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      let username = email_addresses[0].email_address.split("@")[0];

      const existingUser = await User.findOne({ username });

      if (existingUser) {
        username = username + Math.floor(Math.random() * 10000);
      }

      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        full_name: `${first_name || ""} ${last_name || ""}`.trim(),
        profile_picture: image_url,
        username,
      };

      await User.create(userData);

      return { message: "User created successfully" };
    } catch (error) {
      console.error("User creation error:", error.message);
    }
  }
);


// 🔥 USER UPDATE
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;

      const updatedUserData = {
        email: email_addresses[0].email_address,
        full_name: `${first_name || ""} ${last_name || ""}`.trim(),
        profile_picture: image_url,
      };

      await User.findByIdAndUpdate(id, updatedUserData);

      return { message: "User updated successfully" };
    } catch (error) {
      console.error("User update error:", error.message);
    }
  }
);


// 🔥 USER DELETE
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    try {
      const { id } = event.data;

      await User.findByIdAndDelete(id);

      return { message: "User deleted successfully" };
    } catch (error) {
      console.error("User delete error:", error.message);
    }
  }
);


// 🔥 CONNECTION REQUEST REMINDER
const sendNewConnectionRequestRemainder = inngest.createFunction(
  {
    id: "send-new-connection-request-remainder",
    triggers: [{ event: "app/connection-request" }],
  },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    // ✅ Step 1: Send first email
    await step.run("fetch-connection-request", async () => {
      const connection = await Connection.findById(connectionId)
        .populate("from_user_id to_user_id"); // ✅ FIXED

      if (!connection) return;

      const subject = "👋 New Connection Request";

      const body = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi ${connection.to_user_id.full_name},</h2>
        <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
        <p>
          Click 
          <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">
            here
          </a> 
          to accept or reject the request
        </p>
        <br/>
        <p>Thanks,<br/>PingUp - Stay Connected</p>
      </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
    });

    // ✅ Step 2: Wait 24 hours
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24-hours", in24Hours);

    // ✅ Step 3: Send reminder if not accepted
    await step.run("send-connection-request-remainder", async () => {
      const connection = await Connection.findById(connectionId)
        .populate("from_user_id to_user_id"); // ✅ FIXED

      if (!connection) return;

      if (connection.status === "Accepted") {
        return { message: "Already accepted" };
      }

      const subject = "👋 Reminder: Connection Request";

      const body = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi ${connection.to_user_id.full_name},</h2>
        <p>You still have a pending connection request from ${connection.from_user_id.full_name}</p>
        <p>
          Click 
          <a href="${process.env.FRONTEND_URL}/connections" style="color:#10b981;">
            here
          </a> 
          to respond
        </p>
        <br/>
        <p>Thanks,<br/>PingUp - Stay Connected</p>
      </div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });

      return { message: "Reminder sent" };
    });
  }
);


// ✅ Export all functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionRequestRemainder,
];