import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export function useSiteContent() {
  const [settings, setSettings] = useState({});
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. جلب إعدادات الموقع والنصوص
        const { data: contentData } = await supabase.from('site_content').select('*');
        const contentObj = {};
        contentData?.forEach(item => {
          contentObj[item.key] = item.value;
        });
        setSettings(contentObj);

        // 2. جلب الأعمال (Projects)
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });
        setProjects(projectsData || []);

        // 3. جلب آراء العملاء (Testimonials)
        const { data: testimonialsData } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        setTestimonials(testimonialsData || []);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { settings, projects, testimonials, loading };
}