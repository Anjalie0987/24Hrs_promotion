import { useState, useCallback, useMemo } from 'react';
import { BusinessData, createBusiness, updateBusiness } from '@/api/business.api';
import { validateBusinessForm, ValidationErrors } from '@/validation/businessValidation';
import { buildBusinessFormData } from '@/utils/buildBusinessFormData';
import { Step } from '@/components/common/ProgressSteps';

export type LoadingState = 'idle' | 'uploading' | 'creating' | 'generating' | 'success';

export function useBusinessForm(initialData?: BusinessData | null, isEditMode = false) {
  const [formData, setFormData] = useState<BusinessData>({
    name: initialData?.name || '',
    ownerName: initialData?.ownerName || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    instagram: initialData?.instagram || '',
    whatsapp: initialData?.whatsapp || '',
    website: initialData?.website || '',
    email: initialData?.email || '',
    yearsExperience: initialData?.yearsExperience || undefined,
    logoUrl: initialData?.logoUrl || initialData?.logo || '',
    ownerPhotoUrl: initialData?.ownerPhotoUrl || '',
    bannerUrl: initialData?.bannerUrl || '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [ownerPhotoFile, setOwnerPhotoFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [successData, setSuccessData] = useState<BusinessData | null>(null);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field when typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handleFileChange = useCallback((file: File | null, type: 'logo' | 'ownerPhoto') => {
    if (type === 'logo') {
      setLogoFile(file);
      setErrors(prev => ({ ...prev, logo: '' }));
    } else {
      setOwnerPhotoFile(file);
      setErrors(prev => ({ ...prev, ownerPhoto: '' }));
    }
  }, []);

  const steps = useMemo<Step[]>(() => {
    return [
      {
        id: 'upload',
        label: 'Uploading Images',
        state: loadingState === 'uploading' ? 'active' : (['creating', 'generating', 'success'].includes(loadingState) ? 'completed' : 'idle')
      },
      {
        id: 'create',
        label: 'Creating Business',
        state: loadingState === 'creating' ? 'active' : (['generating', 'success'].includes(loadingState) ? 'completed' : 'idle')
      },
      {
        id: 'banner',
        label: 'Generating Banner',
        state: loadingState === 'generating' ? 'active' : (loadingState === 'success' ? 'completed' : 'idle')
      },
      {
        id: 'finalize',
        label: 'Finalizing Profile',
        state: loadingState === 'success' ? 'completed' : 'idle'
      }
    ];
  }, [loadingState]);

  const submitForm = async () => {
    const validationErrors = validateBusinessForm(formData, logoFile, ownerPhotoFile, isEditMode);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoadingState('uploading');
      
      const payload = buildBusinessFormData(formData, logoFile, ownerPhotoFile);

      // Simulate a small delay for UX so steps are visible
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setLoadingState('creating');
      
      let result: BusinessData;
      if (isEditMode) {
        result = await updateBusiness(payload);
      } else {
        result = await createBusiness(payload);
      }

      setLoadingState('generating');
      
      // Simulate backend generating banner time
      await new Promise(resolve => setTimeout(resolve, 800));

      setLoadingState('success');
      setSuccessData(result);
    } catch (error: any) {
      setLoadingState('idle');
      console.error('Submission failed:', error);
      throw error;
    }
  };

  const resetForm = useCallback(() => {
    if (successData) {
      setFormData(prev => ({ ...prev, bannerUrl: successData.bannerUrl }));
    }
    setLoadingState('idle');
  }, [successData]);

  return {
    formData,
    logoFile,
    ownerPhotoFile,
    errors,
    loadingState,
    successData,
    steps,
    handleInputChange,
    handleFileChange,
    submitForm,
    resetForm,
  };
}
