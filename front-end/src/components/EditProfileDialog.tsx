import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ open, onOpenChange }) => {
  const { user, updateProfile } = useAuth();
  const { isRTL } = useLanguage();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    language_preference: 'en' as 'en' | 'ar',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        language_preference: user.language_preference || 'en',
      });
    }
  }, [user]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleLanguageChange = (value: 'en' | 'ar') => {
    setFormData((prev) => ({ ...prev, language_preference: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Only send changed fields
      const updates: any = {};
      if (formData.username !== user?.username) updates.username = formData.username;
      if (formData.email !== user?.email) updates.email = formData.email;
      if (formData.first_name !== user?.first_name) updates.first_name = formData.first_name;
      if (formData.last_name !== user?.last_name) updates.last_name = formData.last_name;
      if (formData.language_preference !== user?.language_preference) {
        updates.language_preference = formData.language_preference;
      }

      if (Object.keys(updates).length === 0) {
        setError(isRTL ? 'لم يتم إجراء أي تغييرات' : 'No changes made');
        setLoading(false);
        return;
      }

      await updateProfile(updates);
      setSuccess(true);
      
      // Close dialog after successful update
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (err: any) {
      console.error('Profile update error:', err);
      let errorMessage = isRTL ? 'فشل تحديث الملف الشخصي' : 'Failed to update profile';
      
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.username) {
          errorMessage = isRTL ? 'اسم المستخدم مستخدم بالفعل' : 'Username already taken';
        } else if (errorData.email) {
          errorMessage = isRTL ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already in use';
        } else if (typeof errorData === 'object') {
          errorMessage = Object.values(errorData)[0] as string;
        }
      } catch {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isRTL ? 'تعديل الملف الشخصي' : 'Edit Profile'}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? 'قم بتحديث معلومات ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.'
              : 'Update your profile information here. Click save when you\'re done.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                {isRTL ? 'اسم المستخدم' : 'Username'}
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل اسم المستخدم' : 'Enter username'}
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                {isRTL ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email'}
                disabled={loading}
                required
              />
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">
                {isRTL ? 'الاسم الأول' : 'First Name'}
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل الاسم الأول' : 'Enter first name'}
                disabled={loading}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">
                {isRTL ? 'اسم العائلة' : 'Last Name'}
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder={isRTL ? 'أدخل اسم العائلة' : 'Enter last name'}
                disabled={loading}
              />
            </div>

            {/* Language Preference */}
            <div className="space-y-2">
              <Label htmlFor="language_preference">
                {isRTL ? 'تفضيل اللغة' : 'Language Preference'}
              </Label>
              <Select
                value={formData.language_preference}
                onValueChange={handleLanguageChange}
                disabled={loading}
              >
                <SelectTrigger id="language_preference">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="border-green-500 text-green-600 dark:text-green-400">
                <AlertDescription>
                  {isRTL
                    ? 'تم تحديث الملف الشخصي بنجاح!'
                    : 'Profile updated successfully!'}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRTL ? 'جاري الحفظ...' : 'Saving...'}
                </>
              ) : (
                isRTL ? 'حفظ التغييرات' : 'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
