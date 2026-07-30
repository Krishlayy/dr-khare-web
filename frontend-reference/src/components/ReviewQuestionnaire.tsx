import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { Star, Loader2, Sparkles, CheckCircle2, User, UserCircle2 } from 'lucide-react';

export function ReviewQuestionnaire({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    rating: 0,
    treatment: '',
    communication: '',
    strengths: '',
    recommend: 'yes' as 'yes' | 'no',
    publishPreference: 'publish_with_name',
    patientName: '',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [finalReview, setFinalReview] = useState('');
  const [generatedReview, setGeneratedReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(3);
    try {
      const res = await api.post('/reviews/generate-summary', {
        treatment: formData.treatment,
        communication: formData.communication,
        strengths: formData.strengths,
        recommend: formData.recommend,
      });
      setFinalReview(res.data.summary);
      setGeneratedReview(res.data.summary);
    } catch (err) {
      const fallback = "I had a wonderful experience. Dr. Khare and the team were exceptionally professional and compassionate.";
      setFinalReview(fallback);
      setGeneratedReview(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/reviews', {
        patientName: formData.publishPreference === 'publish_anonymously' && !formData.patientName ? 'Anonymous Patient' : formData.patientName,
        rating: formData.rating || 5,
        text: finalReview, // for backward compatibility in backend routes
        publishPreference: formData.publishPreference,
        rawResponses: formData,
        generatedReview: generatedReview,
        finalSubmittedReview: finalReview,
        source: 'website'
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-foreground/5 border border-rule/30 rounded-3xl overflow-hidden shadow-2xl relative bg-background"
      >
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2 text-xl">&times;</button>
        </div>

        <div className="p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden">
          {/* Progress Bar */}
          {!isSuccess && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-foreground/10">
              <motion.div 
                className="h-full bg-gold"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 4) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {isSuccess && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="font-display text-3xl mb-4">Thank You</h2>
                <p className="text-muted-foreground mb-8">Thank you. Your feedback has been received and is awaiting moderation.</p>
                <button onClick={onClose} className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium hover:scale-105 transition-transform">
                  Return to Website
                </button>
              </motion.div>
            )}

            {!isSuccess && step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-2">Step 1 of 4</p>
                <h2 className="font-display text-3xl mb-8">Rate Your Experience</h2>
                
                <div className="flex gap-2 mb-10">
                  {[1,2,3,4,5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setFormData({...formData, rating: star})}
                      className={`p-2 transition-transform hover:scale-110 ${formData.rating >= star ? 'text-gold' : 'text-foreground/20'}`}
                    >
                      <Star className="w-12 h-12 fill-current" />
                    </button>
                  ))}
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium mb-3">What was the primary reason for your visit?</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Occupational Health Screening, Consultation..." 
                    className="w-full bg-foreground/5 border border-rule/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                    value={formData.treatment}
                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                  />
                </div>

                <div className="mt-auto flex justify-end">
                  <button 
                    disabled={!formData.rating}
                    onClick={() => setStep(2)} 
                    className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium disabled:opacity-50"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {!isSuccess && step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-2">Step 2 of 4</p>
                <h2 className="font-display text-3xl mb-8">Tell us more</h2>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <label className="block text-sm font-medium mb-2">How would you describe the communication?</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Very clear, took time to listen..." 
                      className="w-full bg-foreground/5 border border-rule/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 resize-none"
                      value={formData.communication}
                      onChange={(e) => setFormData({...formData, communication: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">What stood out the most?</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. The thoroughness of the exam, the modern facility..." 
                      className="w-full bg-foreground/5 border border-rule/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 resize-none"
                      value={formData.strengths}
                      onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">Would you recommend Dr. Khare?</label>
                    <div className="flex gap-4">
                      <button onClick={() => setFormData({...formData, recommend: 'yes'})} className={`flex-1 py-3 rounded-xl border ${formData.recommend === 'yes' ? 'bg-gold/10 border-gold/50 text-gold' : 'border-rule/30 text-muted-foreground'}`}>Yes</button>
                      <button onClick={() => setFormData({...formData, recommend: 'no'})} className={`flex-1 py-3 rounded-xl border ${formData.recommend === 'no' ? 'bg-foreground/10 border-foreground/30' : 'border-rule/30 text-muted-foreground'}`}>No</button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button onClick={() => setStep(1)} className="px-6 py-3 text-sm font-medium text-muted-foreground">Back</button>
                  <button onClick={handleGenerate} className="bg-gold text-foreground px-8 py-3 rounded-full text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Generate Review
                  </button>
                </div>
              </motion.div>
            )}

            {!isSuccess && step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-2">Step 3 of 4</p>
                <h2 className="font-display text-3xl mb-8">Review Your Experience</h2>
                
                {isGenerating ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="w-10 h-10 animate-spin text-gold mb-4" />
                    <p>AI is crafting your testimonial...</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="bg-foreground/5 border border-rule/30 rounded-2xl p-6 relative flex-1">
                      <div className="text-gold text-4xl font-display absolute top-4 left-4 opacity-20">"</div>
                      <textarea 
                        className="w-full h-full bg-transparent border-none resize-none focus:outline-none text-foreground/90 leading-relaxed relative z-10"
                        value={finalReview}
                        onChange={(e) => setFinalReview(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 text-center">Feel free to edit the AI-generated text before submitting.</p>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button disabled={isGenerating} onClick={() => setStep(2)} className="px-6 py-3 text-sm font-medium text-muted-foreground disabled:opacity-50">Back</button>
                  <button disabled={isGenerating || !finalReview} onClick={() => setStep(4)} className="bg-foreground text-background px-8 py-3 rounded-full text-sm font-medium disabled:opacity-50">
                    Approve & Continue
                  </button>
                </div>
              </motion.div>
            )}

            {!isSuccess && step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-2">Step 4 of 4</p>
                <h2 className="font-display text-3xl mb-8">Final Details</h2>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <label className="block text-sm font-medium mb-4">How should we attribute this review?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        onClick={() => setFormData({...formData, publishPreference: 'publish_with_name'})}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.publishPreference === 'publish_with_name' ? 'bg-gold/10 border-gold/50' : 'border-rule/30 hover:bg-foreground/5'}`}
                      >
                        <User className={`w-6 h-6 mb-3 ${formData.publishPreference === 'publish_with_name' ? 'text-gold' : 'text-muted-foreground'}`} />
                        <h4 className="font-medium text-sm mb-1">Publish with Name</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">Your name will appear publicly alongside your review.</p>
                      </div>
                      <div 
                        onClick={() => setFormData({...formData, publishPreference: 'publish_anonymously'})}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.publishPreference === 'publish_anonymously' ? 'bg-gold/10 border-gold/50' : 'border-rule/30 hover:bg-foreground/5'}`}
                      >
                        <UserCircle2 className={`w-6 h-6 mb-3 ${formData.publishPreference === 'publish_anonymously' ? 'text-gold' : 'text-muted-foreground'}`} />
                        <h4 className="font-medium text-sm mb-1">Publish Anonymously</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">Your review will be attributed to "Anonymous Patient".</p>
                      </div>
                    </div>
                  </div>

                  {formData.publishPreference === 'publish_with_name' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}}>
                      <label className="block text-sm font-medium mb-2">Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="First and Last Name" 
                        className="w-full bg-foreground/5 border border-rule/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50"
                        value={formData.patientName}
                        onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                      />
                    </motion.div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button disabled={isSubmitting} onClick={() => setStep(3)} className="px-6 py-3 text-sm font-medium text-muted-foreground">Back</button>
                  <button 
                    disabled={isSubmitting || (formData.publishPreference === 'publish_with_name' && !formData.patientName)} 
                    onClick={handleSubmit} 
                    className="bg-gold text-foreground px-8 py-3 rounded-full text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Submit Review
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
