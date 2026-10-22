import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useLoading } from './LoadingContext'; // ضفنا ده

export function useSiteContent() {
  const [settings, setSettings] = useState({});
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setIsDataLoaded } = useLoading(); // بنستخدم الـ Context

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const { data: contentData } = await supabase.from('site_content').select('*');
        const contentObj = {};
        contentData?.forEach(item => {
          contentObj[item.key] = item.value;
        });
        setSettings(contentObj);

        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        setProjects(projectsData || []);

        const { data: testimonialsData } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        setTestimonials(testimonialsData || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setIsDataLoaded(true); // بنقول للـ Preloader إن الداتا جاهزة
      }
    };

    fetchAllData();
  }, [setIsDataLoaded]);

  return { settings, projects, testimonials, loading };
}