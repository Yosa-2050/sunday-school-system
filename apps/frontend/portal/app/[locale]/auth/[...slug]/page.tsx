
import AuthWrapper from '../_components/Auth';


export default async function AuthPage({
    params,
  }: { params: Promise<{ slug: string[] }> }) {
    const pathSlug = await params;
    const path = pathSlug.slug;

    
  
    return <AuthWrapper path={path} />;
  }
  