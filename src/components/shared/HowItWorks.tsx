import { ArrowRightIcon } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: "Browse Local Markets",
    description: "Search for markets near you and browse available products.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
        <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
        <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
        <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Add to Cart",
    description: "Select your desired products and add them to your shopping cart.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        <path d="M12 9V5" />
        <path d="M9 8h6" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Personal Shopper",
    description: "A personal shopper will accept your order and shop for you.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Receive Your Order",
    description: "Get your products delivered fresh from the local market.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <rect width="16" height="13" x="4" y="6" rx="2" />
        <path d="m22 8-4 4-4-4" />
        <path d="M2 12h2" />
        <path d="M7 19h10" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-background" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get your favorite local market products in four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <div className="text-primary">{step.icon}</div>
              </div>
              <h3 className="mb-2 text-xl font-medium">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center mt-6">
                  <ArrowRightIcon className="h-6 w-6 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;