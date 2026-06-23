import Link from "next/link";
import { Upload, Zap, PlayCircle } from "lucide-react";


const processingSteps = [
  {
    number: 1,
    title: "Input Content",
    description: "Upload PDFs, paste text, or provide URLs. The system ingests your raw knowledge base securely.",
    icon: Upload,
  },
  {
    number: 2,
    title: "AI Processing",
    description: "Our neural engine analyzes the content, extracts key concepts, and formulates challenging questions.",
    icon: Zap,
  },
  {
    number: 3,
    title: "Start Quiz",
    description: "Engage with adaptive quizzes. Receive instant, intelligent feedback to solidify your understanding.",
    icon: PlayCircle,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen   ">
      {/* Galaxy Background — fixed so it covers the entire page at all scroll depths */}
   
      {/* Content Overlay */}
           {/* <div className="bg"></div>

<div className="star-field">
<div className="layer"></div>
<div className="layer"></div>
<div className="layer"></div>
</div> */}
      <div className="relative">
         <div className="bg"></div>

<div className="star-field">
<div className="layer"></div>
<div className="layer"></div>
<div className="layer"></div>

</div>
      
        <main className="flex flex-col">
             
          {/* Hero Section */}
          <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-20 lg:px-8">
            <div className="text-center space-y-8 max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400 bg-white/80 px-4 py-2 text-sm font-medium text-amber-700 backdrop-blur-md shadow-sm">
                ✨ Cognition Refined
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="text-amber-950">Knowledge,</span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                    Supercharged by AI
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-amber-900 max-w-2xl mx-auto leading-relaxed">
                  Instantly transform any content—text, PDFs, or URLs—into interactive, adaptive quizzes. Accelerate learning with cognitive processing at the speed of thought.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/quiz/create"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-3 font-semibold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/70 hover:from-amber-600 hover:to-yellow-600 transition-all"
                >
                  Create Your First Quiz
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border-2 border-amber-500 text-amber-700 px-8 py-3 font-semibold hover:bg-amber-100 transition-all"
                >
                  View Demo
                </Link>
              </div>

              {/* Trust Statement */}
              <p className="text-sm text-amber-800 pt-4">
                Trusted by 50,000+ Learners & Visionaries
              </p>
            </div>
          </section>

          {/* Cognitive Processing Pipeline */}
          <section className="px-6 py-20 lg:px-8 bg-transparent">
                 
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 space-y-2">
                <h2 className="text-4xl font-bold text-amber-950">
                  Cognitive Processing Pipeline
                </h2>
                <p className="text-amber-800">
                  From raw data to active recall in three seamless steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {processingSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.number}
                      className="flex flex-col items-start p-8 rounded-2xl bg-white/70 border border-amber-200 shadow-lg hover:shadow-xl hover:bg-white hover:border-amber-400 transition-all backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-amber-200 to-yellow-100 mb-6">
                        <Icon className="h-7 w-7 text-amber-600" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-amber-950">
                          {step.number}. {step.title}
                        </h3>
                        <p className="text-amber-800 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="px-6 py-16 lg:px-8 text-center bg-transparent">
            <p className="text-sm text-amber-700">
              © 2024 QuizMind AI. Cognition Expanded.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
