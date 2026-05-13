import React, { useEffect } from 'react';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'eka-medassist-widget': any;
    }
  }
}

const ChatWidget = () => {
  useEffect(() => {
    // 1. Create the script element
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@eka-care/medassist-widget-embed@latest/dist/index.js";
    script.async = true;

    // 2. Append the script to the body
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="chat-widget-container">
      {/* 3. The Custom Eka Widget Element */}
      <eka-medassist-widget 
        title="sHero" 
        agent-id="YTRhNmJjMDQtZTQ5My00YTEwLWJiOTEtZGUzNzcwZTFmNzA5IzcxNzY5NjY2MDgyMzI4NzM=" 
        icon-url="https://cdn.eka.care/dev-console/7176966608232873/agents/icons/a3ed42ae-55f4-4017-acb4-3055116ae97d/bot.png">
      </eka-medassist-widget>
    </div>
  );
};

export default ChatWidget;