import React, { useState, useRef, useEffect, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import moment from 'moment';
import Image from './Image';
import user from '../assets/user.png';
import ogicon from '../assets/ogicon.png';
import { getFile } from '../utils/communication';

/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const ChatMessage = (props) => {
  const {id, createdAt, text, ai = false, selected, isLink} = props.message;
  const [fileUrl, setFileUrl] = useState("###");
  let new_text = text;
  if(isLink == 1 || isLink == 2) new_text = "Attached.";
  useEffect(() => {
    const fetchData = async (fileType)=>{
      let fileData = await getFile({fileLink: text, fileType: fileType});
      const blob = new Blob([fileData.data], { type: `application/${fileType}` });
      let fileUrl = URL.createObjectURL(blob);
      setFileUrl(URL.createObjectURL(blob));
      console.log('------------->fileData',fileData);
      console.log('------------->fileUrl',URL.createObjectURL(blob));
    };
    if(isLink ==1)
      fetchData('pdf');
  }, []);
  return (
    <div className='new_message'>
      <div
        key={id}
        className={`${ai && 'flex-row-reverse bg-light-white'} message`}>
        {selected === 'DALL·E' && ai ? (
          <Image url={new_text} />
        ) : (
          <div className='message__wrapper'>
            <ReactMarkdown
              className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
              children={new_text}
              remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || 'language-js');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={oneDark}
                      language={match[1]}
                      PreTag='div'
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}{' '}
                    </code>
                  );
                },
              }}
            />

            <div
              className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>
              {moment(createdAt).calendar()}
            </div>
          </div>
        )}
        
        <div className='message__pic'>
          {ai ? (
            <div className='avatar'>
              <div className='w-8 border rounded-full'>
                <img src={ogicon} alt='chatbot pic' />
              </div>
            </div>
          ) : (
            <div className='avatar'>
              <div className='w-8 border rounded-full'>
                <img src={user} alt='profile pic' />
              </div>
            </div>
          )}
        </div>
      </div>
      {
          (isLink == 1) &&
            <div className='embed'>
              <embed src={fileUrl} type="application/pdf" style={{ width: '58%', height: '500px' }}/>
            </div>
        }
        {
          (isLink == 2) &&
            <div className='embed'>
              <img src={text} type="application/png" style={{ width: '40%', maxHeight: '300px' }}/>
            </div>
        }

    </div>
  );
};

export default ChatMessage;
