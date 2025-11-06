import React from 'react';
import Banner from '../components/Banner';
import Partners from '../components/partners';
import FitnessGoals from '../components/FitnessGoals';
import ProgramsOffer from '../components/ProgramsOffer';
import WhyChoose from '../components/WhyChoose';
import MemberShipPlan from '../components/MemberShipPlan';
import NewsAndUpdate from '../components/NewsAndUpdate';

const Home = () => {
    return (
        <div>
            <Banner/>
            <Partners/>
            <FitnessGoals/>
            <ProgramsOffer/>
            <WhyChoose/>
            <MemberShipPlan/>
            <NewsAndUpdate/>
        </div>
    );
};

export default Home;