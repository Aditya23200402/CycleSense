
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, HeartPulse, LineChart, ShieldCheck } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-cycle-purple flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-cycle-purple rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold">CycleSense</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-cycle-purple-dark">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-cycle-purple-dark">How It Works</a>
            <a href="#benefits" className="text-gray-600 hover:text-cycle-purple-dark">Benefits</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-cycle-purple hover:bg-cycle-purple-dark">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cycle-purple-light via-white to-cycle-blue-light py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Track Your Cycle. <br />
                <span className="text-cycle-purple-dark">Understand Your Body.</span>
              </h1>
              <p className="text-lg text-gray-600">
                CycleSense helps you track your menstrual cycle, predict future periods, and identify patterns to better understand your health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-cycle-purple hover:bg-cycle-purple-dark w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </a>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="w-64 h-64 bg-cycle-pink/20 rounded-full absolute -top-10 -right-10 z-0"></div>
              <div className="w-32 h-32 bg-cycle-blue/20 rounded-full absolute bottom-10 -left-10 z-0"></div>
              <div className="relative z-10 bg-white rounded-2xl shadow-lg p-8">
                <div className="aspect-square max-w-md mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-cycle-purple-light flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-cycle-purple flex items-center justify-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-cycle-purple rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comprehensive Cycle Tracking</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our app provides powerful tools to track your menstrual cycle, symptoms, and health patterns.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cycle-purple-light rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-cycle-purple-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Period Tracking</h3>
              <p className="text-gray-600">
                Log your period days, flow intensity, and symptoms to build a comprehensive picture of your cycle.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cycle-pink-light rounded-full flex items-center justify-center mb-4">
                <HeartPulse className="h-6 w-6 text-cycle-pink-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Health Insights</h3>
              <p className="text-gray-600">
                Receive personalized insights and predictions based on your unique cycle patterns.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cycle-blue-light rounded-full flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-cycle-blue-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Pattern Analysis</h3>
              <p className="text-gray-600">
                Identify irregularities and trends in your cycle with advanced analytics and visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How CycleSense Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our easy-to-use app helps you track, understand, and predict your menstrual cycle in just a few steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cycle-purple flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Cycle</h3>
              <p className="text-gray-600">
                Log your period days, symptoms, and other health factors directly in the app.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cycle-purple flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Predictions</h3>
              <p className="text-gray-600">
                Our algorithm analyzes your data to predict your next period, fertile window, and more.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cycle-purple flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Gain Insights</h3>
              <p className="text-gray-600">
                Receive personalized insights about your cycle health and potential irregularities.
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link to="/register">
              <Button size="lg" className="bg-cycle-purple hover:bg-cycle-purple-dark">
                Get Started Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Use CycleSense?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our app is designed to help you take control of your menstrual health with confidence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-cycle-purple-light rounded-full flex-shrink-0 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-cycle-purple-dark" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
                <p className="text-gray-600">
                  Your health data stays private and secure. We never sell your personal information.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-cycle-purple-light rounded-full flex-shrink-0 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-cycle-purple-dark" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Accurate Predictions</h3>
                <p className="text-gray-600">
                  Our algorithm learns from your data to provide increasingly accurate cycle predictions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-cycle-purple-light rounded-full flex-shrink-0 flex items-center justify-center">
                <LineChart className="h-6 w-6 text-cycle-purple-dark" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Health Awareness</h3>
                <p className="text-gray-600">
                  Identify patterns and potential health concerns with our comprehensive tracking system.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-cycle-purple-light rounded-full flex-shrink-0 flex items-center justify-center">
                <HeartPulse className="h-6 w-6 text-cycle-purple-dark" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Holistic Approach</h3>
                <p className="text-gray-600">
                  Track not just your period but symptoms, mood, and other aspects of reproductive health.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cycle-purple text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Cycle?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of women who use CycleSense to track their menstrual health and gain valuable insights.
          </p>
          <Link to="/register">
            <Button size="lg" variant="outline" className="bg-white text-cycle-purple-dark hover:bg-gray-100 border-white">
              Sign Up for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <div className="w-6 h-6 bg-cycle-purple rounded-full"></div>
                </div>
                <span className="text-xl font-bold">CycleSense</span>
              </div>
              <p className="text-gray-400">
                Track your cycle. Understand your body. Take control of your health.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Feedback</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-6 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} CycleSense. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
