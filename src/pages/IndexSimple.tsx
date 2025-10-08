import React from 'react';
import HeroWorking from '@/components/HeroWorking';

const IndexSimple = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroWorking />
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Shani Social Media</h1>
        <p className="text-xl text-center mb-12">Social Media Management + Video Content</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Starter Package</h3>
            <p className="text-3xl font-bold text-blue-600 mb-4">$750/month</p>
            <ul className="text-left space-y-2">
              <li>• 8 monthly posts</li>
              <li>• Custom captions</li>
              <li>• Scheduling</li>
              <li>• Basic responses</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg text-center border-2 border-blue-500">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">Most Popular</div>
            <h3 className="text-xl font-semibold mb-4">Growth Package</h3>
            <p className="text-3xl font-bold text-blue-600 mb-4">$1,250/month</p>
            <ul className="text-left space-y-2">
              <li>• 12-16 monthly posts</li>
              <li>• 2 shooting sessions</li>
              <li>• UGC-style editing</li>
              <li>• Weekly metrics</li>
            </ul>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Pro Package</h3>
            <p className="text-3xl font-bold text-blue-600 mb-4">$2,000/month</p>
            <ul className="text-left space-y-2">
              <li>• 16-20 monthly posts</li>
              <li>• 3 sessions</li>
              <li>• Full community mgmt</li>
              <li>• Ad support</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold">
            Message on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexSimple;
