import React, { useState } from 'react';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const HelpAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const accordionItems = [
    {
      question: "What is the role of an agent?",
      answer: "Agents serve as the primary point of contact for customers, providing assistance, answering questions, and resolving issues related to products or services."
    },
    {
      question: "What kind of training do agents receive?",
      answer: "Agents undergo comprehensive training that includes product knowledge, communication skills, problem-solving techniques, and company policies to ensure they can effectively assist customers."
    },
    {
      question: "What is expected from an agent when handling customer inquiries?",
      answer: "Agents are expected to be professional, courteous, and efficient."
    },
    {
      question: "How do agents handle difficult or irate customers?",
      answer: "Agents are trained to remain calm and empathetic. "
    },
    {
      question: "Can agents access a customer's account information?",
      answer: "Yes, agents can access customer account information as needed to provide assistance, but they must follow strict privacy and security protocols to protect customer data."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="  mx-auto mt-0 bg-white p-2 z-40" >
      <h1 className="text-sm font-bold mb-0 text-center">Help</h1>
      <hr />
      <div className=" overflow-hidden">
        {accordionItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0">
            <button
              className="w-full flex justify-between items-center p-1 text-left hover:bg-gray-50 transition-colors"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-medium text-xs">{item.question}</span>
              <span className="text-gray-500">
                {activeIndex === index ? <>▴</> : <>▾</>}
              </span>
            </button>
            <div
              className={`px-4 pb-4  text-xs pt-2 bg-gray-50 transition-all duration-300 overflow-hidden ${
                activeIndex === index ? 'block' : 'hidden'
              }`}
            >
              <p className="text-gray-700 text-start">{item.answer}</p>
              {/* <div className="mt-2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpAccordion;