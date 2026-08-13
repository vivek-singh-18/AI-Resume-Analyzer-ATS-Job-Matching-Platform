import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Brain,
  Upload,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const HomePage = () => {
  useDocumentTitle("Home | AI Document Analyzer");

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Document Intelligence</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Documents into Insights
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Upload any PDF or text document and get instant AI-powered
                summaries, key points extraction, sentiment analysis, and more.
                Save hours of reading time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <span>Start Analyzing Free</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    No credit card required
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    10 free analyses
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer hover:border-blue-400">
                    <Upload className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      Drop your document here
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF or TXT, up to 10MB
                    </p>
                  </div>

                  {/* Sample Analysis Preview */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 mb-1">
                            AI Summary
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            This document discusses artificial intelligence and
                            its impact on modern business operations...
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="w-full">
                          <p className="text-sm font-semibold text-gray-800 mb-1">
                            Sentiment: Positive
                          </p>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-green-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full w-4/5"></div>
                            </div>
                            <span className="text-xs text-gray-600">85%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">30s</p>
                    <p className="text-xs text-gray-600">Avg. Analysis Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "PDF & TXT", label: "Supported Formats" },
              { value: "Multi-LLM", label: "OpenAI / Gemini / Claude" },
              { value: "Real-Time", label: "Socket.io Notifications" },
              { value: "100-pt Score", label: "ATS Matching Metric" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand your documents in seconds
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Smart Summarization",
                description:
                  "Get concise 100-200 word summaries that capture the essence of any document instantly.",
                color: "blue",
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Key Points Extraction",
                description:
                  "Automatically extract 5-7 main points from your documents for quick reference.",
                color: "indigo",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Sentiment Analysis",
                description:
                  "Understand the emotional tone of your documents with confidence scores.",
                color: "green",
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Keyword Extraction",
                description:
                  "Identify the top 10 important keywords and phrases automatically.",
                color: "purple",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Question Generation",
                description:
                  "Auto-generate relevant questions to test comprehension and engagement.",
                color: "orange",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Private",
                description:
                  "Your documents are encrypted and never shared. Complete data privacy guaranteed.",
                color: "red",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
              >
                <div
                  className={`bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 w-16 h-16 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to unlock insights from your documents
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                icon: <Upload className="w-10 h-10" />,
                title: "Upload Document",
                description:
                  "Simply drag and drop your PDF or TXT file. Supports documents up to 10MB.",
              },
              {
                step: "02",
                icon: <Sparkles className="w-10 h-10" />,
                title: "AI Analysis",
                description:
                  "Our advanced AI processes your document in seconds, extracting key insights.",
              },
              {
                step: "03",
                icon: <CheckCircle className="w-10 h-10" />,
                title: "Get Results",
                description:
                  "Receive comprehensive analysis with summary, key points, sentiment, and more.",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full">
                  <div className="text-6xl font-bold text-gray-100 mb-4">
                    {step.step}
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="w-12 h-12 text-blue-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-lg font-bold text-white">
              AI Resume Analyzer & ATS Job Matching Platform
            </span>
            <p className="text-xs text-gray-400 mt-1">
              Final Year Computer Science & Engineering Project
            </p>
          </div>
          <div className="text-sm text-gray-400">
            © 2026 Vivek. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
