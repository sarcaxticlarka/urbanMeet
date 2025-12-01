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
import FeaturedEvents from './FeaturedEvents'
import FeaturedGroups from './FeaturedGroups'

const page = () => {
  return (
    <div>
      <HeroSection />
      <SupportSection />
      <FeaturedEvents />
      <PionnerSection />
      <JoinMeetup />
      <TopCategories />
      <PopularCities />

      <FeaturedGroups />
      <CustomerSuccess />
      <SuperchargeCTA />
      <FaqSection />

    </div>
  )
}

export default page