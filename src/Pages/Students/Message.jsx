import { useState, useEffect } from 'react';
import { db } from '../../Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../../Components/Layout';

const DirectMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const messagesCollection = collection(db, 'messages');
      const messageSnapshot = await getDocs(messagesCollection);
      const messageList = messageSnapshot.docs.map(doc => doc.data());
      setMessages(messageList);
    };

    fetchMessages();
  }, []);

  return (
    <Layout>
      <div className='w-full h-full '>
      <div className="max-w-xl mx-auto mt-20 max-h-screen overflow-auto  p-10">
        <h2 className="text-2xl dark:text-gray-300 text-slate-500  text-center font-semibold mb-4">Messages</h2>
        {messages?.length>0 && messages.map((msg, index) => (
          <div key={index} className="p-4 mb-4 text-gray-600 bg-gray-100 rounded-lg">
            <p>{msg.message}</p>
            <small className="text-gray-600">
              Sent to {msg.students.length} students on {msg.timestamp.toDate().toLocaleString()}
            </small>
          </div>
        ))}
        {
          messages?.length==0
          && <div>
            No messages !
          </div>
        }
      </div>
      </div>
    </Layout>
  );
};

export default DirectMessages;
