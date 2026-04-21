import { BadgeCheck, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const StoryViewer = ({ viewStory, setViewStory, onDelete, isOwner }) => {

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let timer, progressInterval;

        if (viewStory && viewStory.media_type !== 'video') {
            setProgress(0);
            const duration = 10000;
            const tick = 100;
            let elapsed = 0;

            progressInterval = setInterval(() => {
                elapsed += tick;
                setProgress((elapsed / duration) * 100);
            }, tick);

            timer = setTimeout(() => {
                setViewStory(null);
            }, duration);
        }

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [viewStory, setViewStory]);

    const handleClose = () => setViewStory(null);

    if (!viewStory) return null;

    const renderContent = () => {
        switch (viewStory.media_type) {
            case 'image':
                return <img src={viewStory.media_url} alt='' className='max-w-full max-h-screen object-contain' />;
            case 'video':
                return <video onEnded={() => setViewStory(null)} src={viewStory.media_url} className='max-h-screen' controls autoPlay />;
            case 'text':
                return (
                    <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center font-medium'>
                        {viewStory.content}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className='fixed inset-0 h-screen z-[110] flex items-center justify-center'
            style={{ backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : '#000000cc' }}
        >
            {/* Progress Bar */}
            {viewStory.media_type !== 'video' && (
                <div className='absolute top-0 left-0 w-full h-1 bg-white/20'>
                    <div
                        className='h-full bg-white transition-all duration-100'
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* User Info */}
            <div className='absolute top-5 left-4 flex items-center gap-3 backdrop-blur-md bg-black/40 px-4 py-2 rounded-full'>
                <img
                    src={viewStory.user?.profile_picture}
                    alt=""
                    className='w-8 h-8 rounded-full object-cover border-2 border-white'
                />
                <div className='text-white font-medium flex items-center gap-1'>
                    <span className='text-sm'>{viewStory.user?.full_name}</span>
                    <BadgeCheck size={15} className='text-blue-400' />
                </div>
            </div>

            {/* Top Right — Delete + Close */}
            <div className='absolute top-5 right-4 flex items-center gap-2'>
                {isOwner && (
                    <button
                        onClick={(e) => onDelete(e, viewStory._id)}
                        className='flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition-all active:scale-95 shadow'
                    >
                        <Trash2 className='w-3.5 h-3.5' />
                        <span>Delete</span>
                    </button>
                )}
                <button
                    onClick={handleClose}
                    className='bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition backdrop-blur-sm'
                >
                    <X className='w-5 h-5' />
                </button>
            </div>

            {/* Story Content */}
            <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
                {renderContent()}
            </div>
        </div>
    );
};

export default StoryViewer;