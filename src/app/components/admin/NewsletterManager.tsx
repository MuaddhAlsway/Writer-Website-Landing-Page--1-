import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Send, Plus, Trash2, Mail, Calendar, AlertCircle, CheckCircle, Eye, Image as ImageIcon, Clock } from 'lucide-react';
import { apiClient } from '@/utils/api';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  language: string;
  createdAt: string;
  sentAt: string | null;
  recipientCount: number;
}

interface NewsletterManagerProps {
  accessToken: string;
}

interface Modal {
  type: 'confirm' | 'success' | 'error' | 'preview' | 'templates';
  title: string;
  message: string;
  action?: () => void;
  content?: string;
}

const newsletterTemplates = {
  preorder: {
    name: 'Preorder Announcement',
    subject: '✨ The Wait Ends Soon - Preorders Open Now! ✨',
    content: `<div style="text-align: center; margin-bottom: 30px;">
<h1 style="color: #8b5cf6; font-size: 32px; margin: 0;">🌟 A New World Awaits 🌟</h1>
<p style="color: #6366f1; font-size: 18px; font-weight: bold;">The adventure you've been waiting for is almost here</p>
</div>

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
<h2 style="margin-top: 0;">Preorders Are Now LIVE</h2>
<p style="font-size: 18px; line-height: 1.8;">Step into a realm of wonder. Experience a story that will captivate your soul and transport you to worlds beyond imagination.</p>
</div>

<h3 style="color: #8b5cf6; font-size: 20px;">✨ Why Preorder This Masterpiece?</h3>
<ul style="font-size: 16px; line-height: 2;">
<li>🎁 <strong>Exclusive Early Access</strong> - Read it before the world</li>
<li>💎 <strong>Premium Pricing</strong> - Save 25% on preorder</li>
<li>🎨 <strong>Bonus Content</strong> - Exclusive artwork & author's notes</li>
<li>📖 <strong>Signed Edition</strong> - Limited collector's edition available</li>
</ul>

<div style="background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; border-radius: 8px; margin: 20px 0;">
<p style="margin: 0; color: #92400e; font-weight: bold;">⏰ Limited Time Offer: Preorder closes in 30 days. Secure your copy now before it's gone forever.</p>
</div>

<div style="text-align: center; margin: 30px 0;">
<a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">🚀 PREORDER NOW 🚀</a>
</div>`
  },
  release: {
    name: 'Release Celebration',
    subject: '🎉 IT\'S HERE! Your Epic Journey Begins TODAY! 🎉',
    content: `<div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px; color: white; margin-bottom: 30px;">
<h1 style="font-size: 36px; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🌟 THE MOMENT HAS ARRIVED 🌟</h1>
<p style="font-size: 20px; margin: 10px 0 0 0;">Your adventure is waiting. Are you ready?</p>
</div>

<h2 style="color: #8b5cf6; font-size: 28px; text-align: center;">After months of anticipation...</h2>

<div style="background: #f3f4f6; padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 5px solid #8b5cf6;">
<p style="font-size: 18px; line-height: 1.8; color: #1f2937; margin: 0;">
We are absolutely thrilled to announce that our most ambitious work is now available. This isn't just a book—it's a portal to extraordinary worlds, unforgettable characters, and stories that will stay with you forever.
</p>
</div>

<h3 style="color: #8b5cf6; font-size: 22px;">📖 What Awaits Inside:</h3>
<ul style="font-size: 16px; line-height: 2; color: #374151;">
<li>✨ Breathtaking world-building that defies imagination</li>
<li>💫 Characters so real, you'll feel their heartbeat</li>
<li>🔥 Plot twists that will leave you speechless</li>
<li>🌈 Themes that touch the deepest parts of your soul</li>
</ul>

<div style="text-align: center; margin: 30px 0;">
<a href="#" style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; padding: 18px 45px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);">📚 GET YOUR COPY NOW 📚</a>
</div>

<p style="text-align: center; color: #6b7280; font-style: italic; margin-top: 20px;">Available in all formats: Hardcover • Paperback • eBook • Audiobook</p>`
  },
  reviews: {
    name: 'Share Reviews',
    subject: '⭐ Readers Are OBSESSED - See Why! ⭐',
    content: `<div style="text-align: center; margin-bottom: 30px;">
<h1 style="color: #f59e0b; font-size: 32px; margin: 0;">🌟 READER REVIEWS ARE IN 🌟</h1>
<p style="color: #6b7280; font-size: 16px;">And they're absolutely incredible...</p>
</div>

<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 5px solid #f59e0b;">
<p style="font-size: 18px; font-weight: bold; color: #92400e; margin: 0;">⭐⭐⭐⭐⭐ 4.9 out of 5 stars</p>
<p style="color: #92400e; margin: 5px 0 0 0;">Based on 1,200+ verified reader reviews</p>
</div>

<h3 style="color: #8b5cf6; font-size: 20px; margin-top: 30px;">What Readers Are Saying:</h3>

<div style="background: white; border: 2px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 15px 0;">
<p style="font-size: 16px; font-style: italic; color: #374151; margin: 0;">
"This book absolutely destroyed me in the best way possible. I couldn't put it down. Every page was pure magic. This is the kind of story that changes you."
</p>
<p style="font-weight: bold; color: #8b5cf6; margin: 10px 0 0 0;">— Sarah M. ⭐⭐⭐⭐⭐</p>
</div>

<div style="background: white; border: 2px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 15px 0;">
<p style="font-size: 16px; font-style: italic; color: #374151; margin: 0;">
"I've read thousands of books. This is in my top 5 of all time. The world-building is phenomenal, the characters are unforgettable, and the ending left me speechless."
</p>
<p style="font-weight: bold; color: #8b5cf6; margin: 10px 0 0 0;">— James K. ⭐⭐⭐⭐⭐</p>
</div>

<div style="background: white; border: 2px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 15px 0;">
<p style="font-size: 16px; font-style: italic; color: #374151; margin: 0;">
"A masterpiece. Truly. This book will haunt you, inspire you, and make you believe in the power of storytelling again."
</p>
<p style="font-weight: bold; color: #8b5cf6; margin: 10px 0 0 0;">— Emma R. ⭐⭐⭐⭐⭐</p>
</div>

<div style="text-align: center; margin: 30px 0;">
<a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">JOIN THE THOUSANDS WHO LOVED IT</a>
</div>`
  },
  formats: {
    name: 'Multiple Reading Formats',
    subject: '📖 Read It YOUR Way - 4 Epic Formats Available 📖',
    content: `<div style="text-align: center; margin-bottom: 30px;">
<h1 style="color: #8b5cf6; font-size: 32px; margin: 0;">📚 CHOOSE YOUR ADVENTURE 📚</h1>
<p style="color: #6b7280; font-size: 16px;">One story. Infinite ways to experience it.</p>
</div>

<h2 style="color: #8b5cf6; text-align: center; margin: 30px 0;">Pick Your Perfect Format:</h2>

<div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; margin: 20px 0; color: white;">
<h3 style="margin-top: 0; font-size: 22px;">📕 HARDCOVER - The Collector's Edition</h3>
<p style="font-size: 16px; line-height: 1.8;">Premium quality with stunning cover art. Perfect for your bookshelf. Includes exclusive author's note and beautiful illustrations.</p>
<p style="font-weight: bold; font-size: 18px;">$28.99</p>
</div>

<div style="background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); padding: 25px; border-radius: 12px; margin: 20px 0; color: white;">
<h3 style="margin-top: 0; font-size: 22px;">📗 PAPERBACK - The Affordable Classic</h3>
<p style="font-size: 16px; line-height: 1.8;">Lightweight and portable. Perfect for travel, beach reads, or sharing with friends. Same incredible story, easier on the wallet.</p>
<p style="font-weight: bold; font-size: 18px;">$16.99</p>
</div>

<div style="background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); padding: 25px; border-radius: 12px; margin: 20px 0; color: white;">
<h3 style="margin-top: 0; font-size: 22px;">📱 eBOOK - Read Instantly Anywhere</h3>
<p style="font-size: 16px; line-height: 1.8;">Available on Kindle, Apple Books, and more. Read on any device. Instant delivery. Perfect for night owls and early risers.</p>
<p style="font-weight: bold; font-size: 18px;">$9.99</p>
</div>

<div style="background: linear-gradient(135deg, #34d399 0%, #10b981 100%); padding: 25px; border-radius: 12px; margin: 20px 0; color: white;">
<h3 style="margin-top: 0; font-size: 22px;">🎧 AUDIOBOOK - Experience the Story</h3>
<p style="font-size: 16px; line-height: 1.8;">Professionally narrated by award-winning voice actors. Perfect for commutes, workouts, or relaxing. Immerse yourself in the story.</p>
<p style="font-weight: bold; font-size: 18px;">$14.99</p>
</div>

<div style="text-align: center; margin: 30px 0;">
<a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">CHOOSE YOUR FORMAT NOW</a>
</div>`
  },
  futureBooks: {
    name: 'Future Books Update',
    subject: '👀 EXCLUSIVE SNEAK PEEK: What\'s Coming Next! 👀',
    content: `<div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px; color: white; margin-bottom: 30px;">
<h1 style="font-size: 32px; margin: 0;">🔮 THE FUTURE IS BRIGHT 🔮</h1>
<p style="font-size: 18px; margin: 10px 0 0 0;">We're working on something extraordinary...</p>
</div>

<h2 style="color: #8b5cf6; text-align: center; font-size: 28px;">Coming Soon to a Bookshelf Near You</h2>

<div style="background: #f3f4f6; padding: 30px; border-radius: 12px; margin: 20px 0; border-left: 5px solid #8b5cf6;">
<h3 style="color: #8b5cf6; margin-top: 0; font-size: 24px;">📖 [Your Next Epic Adventure]</h3>
<p style="font-size: 16px; color: #374151; line-height: 1.8;">
<strong>Release Date:</strong> [Expected Date]<br>
<strong>Genre:</strong> [Genre/Category]<br>
<strong>Status:</strong> Currently in final editing phase
</p>
</div>

<h3 style="color: #8b5cf6; font-size: 20px;">What to Expect:</h3>
<p style="font-size: 16px; line-height: 1.8; color: #374151;">
This next installment will take you deeper into the world you've come to love. Expect:
</p>
<ul style="font-size: 16px; line-height: 2; color: #374151;">
<li>✨ Even more immersive world-building</li>
<li>💫 New characters that will steal your heart</li>
<li>🔥 Plot twists you won't see coming</li>
<li>🌈 Emotional depth that will move you</li>
</ul>

<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 25px; border-radius: 12px; margin: 20px 0; border-left: 5px solid #f59e0b;">
<h3 style="color: #92400e; margin-top: 0;">🎁 Be the First to Know</h3>
<p style="color: #92400e; font-size: 16px; line-height: 1.8;">
Sign up for our exclusive VIP list to get notified the MOMENT preorders open. VIP members also get special perks and early access to bonus content!
</p>
</div>

<div style="text-align: center; margin: 30px 0;">
<a href="#" style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">JOIN THE VIP LIST</a>
</div>`
  },
  monthlyWrapup: {
    name: 'Monthly Wrap-Up',
    subject: '📰 Your Monthly Reading Digest - What You Missed! 📰',
    content: `<div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 12px; color: white; margin-bottom: 30px;">
<h1 style="font-size: 32px; margin: 0;">📚 THIS MONTH IN REVIEW 📚</h1>
<p style="font-size: 18px; margin: 10px 0 0 0;">The highlights you need to know about</p>
</div>

<h2 style="color: #8b5cf6; font-size: 24px;">🎯 This Month's Biggest Moments</h2>

<div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 25px; border-radius: 12px; margin: 20px 0; color: white;">
<h3 style="margin-top: 0; font-size: 20px;">📖 Book Milestones</h3>
<ul style="font-size: 16px; line-height: 2; margin: 0;">
<li>🏆 [Book Title] hit #1 on the bestseller list!</li>
<li>⭐ [Book] reached 5,000+ five-star reviews</li>
<li>🎉 We've sold over 100,000 copies this month</li>
</ul>
</div>

<div style="background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); padding: 25px; border-radius: 12px; margin: 20px 0; color: white;">
<h3 style="margin-top: 0; font-size: 20px;">💫 Community Highlights</h3>
<ul style="font-size: 16px; line-height: 2; margin: 0;">
<li>👥 Our book club grew to 5,000+ members</li>
<li>📸 Amazing fan art shared on social media</li>
<li>💬 Incredible reader discussions and theories</li>
</ul>
</div>

<div style="background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%); padding: 25px; border-radius: 12px; margin: 20px 0; color: white;">
<h3 style="margin-top: 0; font-size: 20px;">🎁 Special Offers This Month</h3>
<p style="font-size: 18px; font-weight: bold; margin: 0;">🔥 FLASH SALE: 30% OFF All Formats</p>
<p style="font-size: 16px; margin: 10px 0 0 0;">Use code: <strong>MONTHLY30</strong></p>
<p style="font-size: 14px; margin: 5px 0 0 0;">Valid through the end of the month only!</p>
</div>

<h3 style="color: #8b5cf6; font-size: 20px; margin-top: 30px;">🌟 Featured Reader Review</h3>
<div style="background: white; border: 3px solid #8b5cf6; padding: 20px; border-radius: 8px; margin: 15px 0;">
<p style="font-size: 16px; font-style: italic; color: #374151; margin: 0;">
"This book is a masterpiece. I've recommended it to everyone I know. It's the kind of story that stays with you forever."
</p>
<p style="font-weight: bold; color: #8b5cf6; margin: 10px 0 0 0;">— [Reader Name] ⭐⭐⭐⭐⭐</p>
</div>

<div style="text-align: center; margin: 30px 0;">
<a href="#" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; display: inline-block;">SHOP NOW & SAVE 30%</a>
</div>

<p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px;">
Thank you for being part of our incredible community. We couldn't do this without you! 💜
</p>`
  }
};

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'color': [] }, { 'background': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

export function NewsletterManager({ accessToken }: NewsletterManagerProps) {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<'en' | 'ar' | 'both'>('both');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal | null>(null);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');

  useEffect(() => {
    apiClient.setToken(accessToken);
    loadNewsletters();
  }, [accessToken]);

  const loadNewsletters = async () => {
    try {
      setError('');
      const data = await apiClient.getNewsletters();
      setNewsletters(data.newsletters || []);
    } catch (err: any) {
      console.error('Failed to load newsletters:', err);
      setError(err.message || 'Failed to load newsletters');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!subject.trim()) {
        throw new Error('Subject is required');
      }

      if (!content.trim()) {
        throw new Error('Content is required');
      }

      let htmlContent = content;
      if (featuredImage) {
        htmlContent = `<div style="text-align: center; margin-bottom: 20px;"><img src="${featuredImage}" style="max-width: 100%; height: auto; border-radius: 8px;" alt="Featured Image"></div>${content}`;
      }

      await apiClient.createNewsletter(
        subject,
        htmlContent,
        language === 'both' ? '' : language
      );

      setSubject('');
      setContent('');
      setFeaturedImage('');
      setScheduledTime('');
      setLanguage('both');
      setShowCreateForm(false);
      loadNewsletters();
    } catch (err: any) {
      console.error('Create newsletter error:', err);
      setError(err.message || 'Failed to create newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Compress image if needed
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if too large
          if (width > 600) {
            height = (height * 600) / width;
            width = 600;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
          setFeaturedImage(compressedImage);
          setError('');
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const applyTemplate = (templateKey: keyof typeof newsletterTemplates) => {
    const template = newsletterTemplates[templateKey];
    setSubject(template.subject);
    setContent(template.content);
    setShowCreateForm(true);
    setModal(null);
  };

  const handleSend = async (id: string) => {
    setModal({
      type: 'confirm',
      title: 'Send Newsletter',
      message: 'Are you sure you want to send this newsletter to all subscribers?',
      action: async () => {
        setSending(id);
        try {
          // Call backend API to send newsletter
          const result = await apiClient.sendNewsletter(id);

          setModal({
            type: 'success',
            title: 'Newsletter Sent',
            message: `Newsletter sent successfully to ${result.recipientCount} recipients! (${result.successCount} successful)`,
          });
          loadNewsletters();
        } catch (err: any) {
          console.error('Send newsletter error:', err);
          setModal({
            type: 'error',
            title: 'Error',
            message: err.message || 'Failed to send newsletter',
          });
        } finally {
          setSending(null);
        }
      },
    });
  };

  const handleDelete = async (id: string) => {
    setModal({
      type: 'confirm',
      title: 'Delete Newsletter',
      message: 'Are you sure you want to delete this newsletter?',
      action: async () => {
        try {
          await apiClient.deleteNewsletter(id);
          setNewsletters(newsletters.filter(n => n.id !== id));
          setModal({
            type: 'success',
            title: 'Deleted',
            message: 'Newsletter deleted successfully',
          });
        } catch (err: any) {
          console.error('Failed to delete newsletter:', err);
          setModal({
            type: 'error',
            title: 'Error',
            message: err.message || 'Failed to delete newsletter',
          });
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-stone-900">Newsletter Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setModal({ type: 'templates', title: 'Newsletter Templates', message: '' })}
            variant="outline"
            className="text-stone-700"
          >
            📋 Templates
          </Button>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-stone-800 hover:bg-stone-900 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Newsletter
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">New Newsletter</h3>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Subject *
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Newsletter subject..."
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Featured Image
              </label>
              <div className="flex gap-3 items-start">
                <label className="flex-1 flex items-center justify-center px-4 py-6 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-stone-400 transition bg-stone-50">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-stone-400" />
                    <span className="text-sm text-stone-600 block">Click to upload image</span>
                    <span className="text-xs text-stone-500 block mt-1">Max 2MB • JPG, PNG, GIF</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {featuredImage && (
                  <div className="relative">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-stone-200">
                      <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold transition"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Language Target
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg bg-white"
              >
                <option value="both">All Subscribers</option>
                <option value="en">English Only</option>
                <option value="ar">Arabic Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Content *
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                theme="snow"
                placeholder="Write your newsletter content here..."
                className="bg-white rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-stone-800 hover:bg-stone-900 text-white"
              >
                {loading ? 'Creating...' : 'Create Newsletter'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (content.trim()) {
                    let previewContent = content;
                    if (featuredImage) {
                      previewContent = `<div style="text-align: center; margin-bottom: 20px;"><img src="${featuredImage}" style="max-width: 100%; height: auto; border-radius: 8px;" alt="Featured Image"></div>${content}`;
                    }
                    setModal({
                      type: 'preview',
                      title: 'Preview',
                      message: '',
                      content: previewContent,
                    });
                  }
                }}
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setSubject('');
                  setContent('');
                  setFeaturedImage('');
                  setScheduledTime('');
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Newsletters List */}
      <div className="grid gap-4">
        {newsletters.length === 0 ? (
          <Card className="p-8 bg-white shadow-lg text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-stone-400" />
            <p className="text-stone-600">No newsletters yet. Create your first one!</p>
          </Card>
        ) : (
          newsletters.map((newsletter) => (
            <Card key={newsletter.id} className="p-6 bg-white shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    {newsletter.subject}
                  </h3>
                  <div className="flex gap-4 text-sm text-stone-600 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(newsletter.createdAt).toLocaleDateString()}
                    </span>
                    {newsletter.language && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        newsletter.language === 'ar' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {newsletter.language === 'ar' ? 'Arabic' : 'English'}
                      </span>
                    )}
                  </div>
                  <div 
                    className="text-stone-700 line-clamp-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: newsletter.content.substring(0, 200) }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <div>
                  {newsletter.sentAt ? (
                    <div className="text-sm">
                      <span className="text-green-600 font-medium">✓ Sent</span>
                      <span className="text-stone-600 ml-2">
                        to {newsletter.recipientCount} recipients on{' '}
                        {new Date(newsletter.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-amber-600 font-medium">Draft</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!newsletter.sentAt && (
                    <Button
                      onClick={() => handleSend(newsletter.id)}
                      disabled={sending === newsletter.id}
                      size="sm"
                      className="bg-stone-800 hover:bg-stone-900 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Now
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(newsletter.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 bg-white shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {modal.type === 'templates' ? (
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-4">Newsletter Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(newsletterTemplates).map(([key, template]) => (
                    <Card key={key} className="p-4 border-2 border-stone-200 hover:border-stone-400 cursor-pointer transition">
                      <h4 className="font-semibold text-stone-900 mb-2">{template.name}</h4>
                      <p className="text-sm text-stone-600 mb-4">{template.subject}</p>
                      <Button
                        onClick={() => applyTemplate(key as keyof typeof newsletterTemplates)}
                        className="w-full bg-stone-800 hover:bg-stone-900 text-white"
                        size="sm"
                      >
                        Use Template
                      </Button>
                    </Card>
                  ))}
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    onClick={() => setModal(null)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : modal.type === 'preview' ? (
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-4">Email Preview</h3>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <div 
                    className="bg-white p-6 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: modal.content || '' }}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    onClick={() => setModal(null)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div>
                  {modal.type === 'confirm' && <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />}
                  {modal.type === 'success' && <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />}
                  {modal.type === 'error' && <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">{modal.title}</h3>
                  <p className="text-stone-600 mb-6">{modal.message}</p>
                  <div className="flex gap-3 justify-end">
                    {modal.type === 'confirm' ? (
                      <>
                        <Button
                          onClick={() => setModal(null)}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            modal.action?.();
                            setModal(null);
                          }}
                          className="bg-stone-800 hover:bg-stone-900 text-white"
                        >
                          Confirm
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setModal(null)}
                        className={modal.type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
