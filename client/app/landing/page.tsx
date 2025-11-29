import React from 'react'
import HeroSection from './HeroSection'
import SupportSection from './SupportExpenses'
import PionnerSection from './PioneeringFuture' 
import CustomerSuccess from './CustomerSuccess'
import SuperchargeCTA from './SuperchargeCTA'
import FaqSection from './FaqSection'
import JoinMeetup from './JoinMeetup'
import TopCategories from './TopCategories'
import PopularCities from './PopularCities'

const page = () => {
  return (
    <div>
        <HeroSection />
        <SupportSection />
        <PionnerSection />
        <JoinMeetup />
        <TopCategories />
        <PopularCities />
        <CustomerSuccess />
        <SuperchargeCTA />
        <FaqSection />
        
    </div>
  )
}

export default page