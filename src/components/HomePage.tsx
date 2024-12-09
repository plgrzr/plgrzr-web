import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSearch, Shield, Zap, Check } from "lucide-react";

import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-primary">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold mb-6 text-primary-foreground">
              Detect Document Similarities with AI Precision
            </h1>
            <p className="text-xl text-primary-foreground/80">
              Advanced document comparison tool powered by machine learning.
              Compare texts, detect similarities, and ensure originality with
              confidence.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/auth")}
              >
                Try For Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Plgrzr?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-primary" />,
                title: "Lightning Fast",
                description:
                  "Compare documents in seconds with our optimized AI engine",
              },
              {
                icon: <Shield className="w-8 h-8 text-primary" />,
                title: "99.9% Accuracy",
                description:
                  "Industry-leading accuracy in detecting document similarities",
              },
              {
                icon: <FileSearch className="w-8 h-8 text-primary" />,
                title: "Deep Analysis",
                description:
                  "Get detailed insights into text structure and patterns",
              },
            ].map((feature, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Card key={index} className="text-center">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "100+", label: "Documents Compared" },
              { number: "99%", label: "Accuracy Rate" },
              { number: "1", label: "Happy Users" },
              { number: "8/7", label: "Support" },
            ].map((stat, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Upload Documents",
                  description:
                    "Simply drag and drop your documents or paste your text",
                },
                {
                  step: "2",
                  title: "AI Analysis",
                  description:
                    "Our advanced AI analyzes the content in seconds",
                },
                {
                  step: "3",
                  title: "Get Results",
                  description:
                    "Receive detailed similarity reports and insights",
                },
              ].map((step, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <div key={index} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "$0",
                period: "Free Forever",
                features: [
                  "5 documents/month",
                  "Basic comparison",
                  "Email support",
                ],
              },
              {
                name: "Pro",
                price: "$29",
                period: "per month",
                features: [
                  "100 documents/month",
                  "Advanced analysis",
                  "Priority support",
                  "API access",
                ],
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "per month",
                features: [
                  "Unlimited documents",
                  "Custom features",
                  "24/7 support",
                  "Dedicated manager",
                ],
              },
            ].map((plan, index) => (
              <Card
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className={`relative ${index === 1 ? "border-primary" : ""}`}
              >
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-muted-foreground">{plan.period}</div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => navigate("/auth")}
                    className="w-full"
                    variant={index === 1 ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/80">
            Join thousands of satisfied users who trust Plgrzr
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth")}
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
