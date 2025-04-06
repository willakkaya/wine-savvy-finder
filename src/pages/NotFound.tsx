
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageContainer title="Page Not Found">
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-wine">404</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Oops! We couldn't find the page you're looking for.
          </p>
          <Button asChild>
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
