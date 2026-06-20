export interface StrategicAnswers {
  architecture: string;
  bookingStrategy: string;
  ctaStrategy: string;
  differentiation: string;
  socialProof: string;
  successDefinition: string;
}

export interface EventPackage {
  name: string;
  price: string;
  inclusions: string[];
}

export interface LandingPageCopy {
  heroTitle: string;
  heroSubtitle: string;
  comparativeHook: string;
  salon1HeroCopy: string;
  salon1Description: string;
  salon1Packages: EventPackage[];
  salon2HeroCopy: string;
  salon2Description: string;
  salon2Packages: EventPackage[];
  recommendedTestimonials: {
    author: string;
    eventType: string;
    content: string;
    rating: number;
  }[];
}

export interface SalonConfig {
  name: string;
  style: string;
  capacity: number;
  amenities: string[];
  basePrice: number;
  imageUrl: string;
}

export interface BookingState {
  salonName: string;
  packageName: string;
  packagePrice: string;
  date: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  additionalNotes: string;
}

export interface InquiryLog extends BookingState {
  id: string;
  status: "pendiente" | "contactado" | "confirmado";
  createdAt: string;
}

export interface StrategicScorecard {
  questionsAnswered: number;
  scorecardReady: boolean;
  scoreExplanation: string;
  registeredViews: number;
  registeredClicks: number;
  registeredQuotes: number;
}
