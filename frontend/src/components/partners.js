import React from 'react';
import './Partners.css'; // Using the same CSS file as before

const partnerList = [
  'NIKE',
  'GYMSHARK',
  'ADIDAS',
  'PUMA',
  'UNDER ARMOUR',
  'MYFITNESSPAL',
  'APPLE HEALTH',
  'GARMIN'
];

const Partners = () => {
  return (
    // REDUCED PADDING: Changed py-16 sm:py-24 to py-8 sm:py-12
    <section className="bg-stone-800 py-8 sm:py-12 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">
          Trusted By The Best
        </h2>
        {/* REDUCED MARGIN: Changed mb-12 to mb-8 */}
        <p className="text-center text-gray-400 mb-4 max-w-2xl mx-auto">
          We collaborate with leading brands in the fitness and wellness industry to bring you an unparalleled experience.
        </p>

        <div className="scroller-container">
          <div className="scroller">
            {[...partnerList, ...partnerList].map((name, index) => (
              <span 
                key={index} 
                className="text-gray-400 text-2xl font-semibold tracking-wider whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;