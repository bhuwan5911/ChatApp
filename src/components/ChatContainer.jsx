import React, { useRef, useEffect } from 'react';
import assets, { messagesDummyData } from '../assets/assets';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
    const scrollEnd = useRef();

    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messagesDummyData, selectedUser]);

    return selectedUser ? (
        <div className='h-full flex flex-col relative backdrop-blur-lg'>
            {/*----------------- Header -----------------*/}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img src={assets.profile_martin} alt="" className="w-8 rounded-full" />
                <p className='flex-1 text-lg text-white flex items-center gap-2'>
                    Pradyun Sandhu
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                </p>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt=""
                    className='md:hidden max-w-7 cursor-pointer' />
                <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
            </div>

            {/*----------------- Chat Area -----------------*/}
            <div className='flex-1 overflow-y-scroll p-3 pb-6'>
                {messagesDummyData.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.senderId === '680f504f10f3cd28382ecf9' ? 'justify-end' : 'justify-start'}`}>
                        {/* Avatar and Timestamp */}
                        <div className="text-center text-xs">
                            <img src={msg.senderId === '680f504f10f3cd28382ecf9' ? assets.profile_icon : assets.profile_martin} alt="" className='w-7 rounded-full' />
                            <p className='text-gray-500'> {formatMessageTime(msg.createdAt)}</p>
                        </div>
                        {/* Message bubble (image or text) */}
                        {msg.image ? (
                            <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
                        ) : (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-words bg-violet-500/30 text-white ${msg.senderId === '680f504f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
                        )}
                    </div>
                ))}
                {/* Empty div at the end of the list for the ref to attach to */}
                <div ref={scrollEnd}></div>
            </div>

            {/*---------------bottom area---------------*/}
            <div className='flex items-center gap-3 p-3'> {/* This is absolute positioned in your original, which might be intended */}
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input type="text" placeholder="Send a message"
                        className='flex-1 text-sm p-3 bg-transparent border-none rounded-lg outline-none text-white placeholder-gray-400' />
                    <input type="file" id='image' accept='image/*' hidden />
                    
                    {/* CORRECTED: The <img> is now inside the <label> and the stray quote is removed */}
                    <label htmlFor="image">
                        <img src={assets.gallery_icon} alt="" className="w-5 mr-2 cursor-pointer" />
                    </label>
                </div>
                <img src={assets.send_button} alt="" className="w-7 cursor-pointer" />
            </div>
            
            {/* REMOVED the extra closing </div> that was here */}
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
            <img src={assets.logo_icon} className='max-w-16' alt="" />
            <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
        </div>
    );
};

export default ChatContainer;