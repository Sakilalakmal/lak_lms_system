"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, Users, Award } from "lucide-react";

export function BentoGridFeatures() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            ELEVATE YOUR TEACHING
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Empower educators, inspire learners
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Transform your teaching experience with powerful tools designed for
            modern education
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Course Management (Large) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 bg-blue-500 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  Course Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create and organize courses with intuitive tools
                </p>
              </div>
            </div>

            {/* Mock UI - Course Goals */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Marketing - 26 goals
                </span>
                <span className="text-xs text-muted-foreground">
                  🎯 MY IMPACT
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Improve brand awareness</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">
                    Increase international revenue
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded-full flex-shrink-0" />
                  <span className="text-sm">Increase sales in ANZ by 10%</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded-full flex-shrink-0" />
                  <span className="text-sm">Complete EMEA rep sales chain</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Communication */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-3xl p-8 border border-teal-100 dark:border-teal-900/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">1:1s</h3>
                <p className="text-sm text-muted-foreground">
                  Productive meetings with auto-suggested agendas
                </p>
              </div>
            </div>

            {/* Mock UI - Meeting Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  RG
                </div>
                <div>
                  <p className="font-medium text-sm">Ruby Gu</p>
                  <p className="text-xs text-muted-foreground">
                    Account Executive
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  Agenda
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm">New presentation deck review</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-sm">PTO request</span>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-3">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Because you are Ruby&apos;s manager
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  What&apos;s one skill I could better or more feedback to help
                  you succeed?
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 - Progress Tracking */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-3xl p-8 border border-amber-100 dark:border-amber-900/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 bg-amber-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Stay in sync with weekly status updates
                </p>
              </div>
            </div>

            {/* Mock UI - Weekly Update */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">KM</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Kevin Booker</p>
                  <p className="text-xs text-muted-foreground">Weekly update</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  What did you focus on?
                </p>
                <p className="text-sm leading-relaxed">
                  This week, I worked on the new manager training program.
                  Implementation is moving quickly, but it will need team
                  collaboration to succeed.
                </p>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-muted-foreground">
                  How are you feeling?
                </span>
              </div>
              <div className="flex gap-2">
                <div className="text-2xl">😊</div>
                <div className="text-2xl opacity-30">😐</div>
                <div className="text-2xl opacity-30">😟</div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-muted-foreground">
                  Average team sentiment:
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    Avg 8.2/10
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Score: 9
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Student Success (Dark/Highlight) */}
          <div className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow text-white">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 bg-white/20 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Student Success</h3>
                <p className="text-sm text-emerald-100">
                  Celebrate achievements and track progress
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold mb-3 leading-tight">
                    &quot;I love getting notified that my team member received
                    praise so I can bring it up in our next one-on-one.&quot;
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">KT</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Kyle Teague</p>
                      <p className="text-xs text-emerald-100">
                        Director of Learning and Development, Olo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
