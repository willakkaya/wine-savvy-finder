-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('consumer', 'corporate_admin', 'restaurant_partner', 'super_admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  zip_code TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  cuisine_type TEXT,
  price_range INTEGER CHECK (price_range BETWEEN 1 AND 4),
  is_partner BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT CHECK (subscription_tier IN ('basic', 'premium', 'enterprise')),
  monthly_fee DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on restaurants
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Restaurant policies
CREATE POLICY "Anyone can view active partner restaurants"
  ON public.restaurants FOR SELECT
  USING (is_partner = TRUE AND is_active = TRUE);

CREATE POLICY "Restaurant owners can view their own restaurants"
  ON public.restaurants FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Restaurant owners can update their own restaurants"
  ON public.restaurants FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Super admins can manage all restaurants"
  ON public.restaurants FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Create corporate_accounts table
CREATE TABLE public.corporate_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  industry TEXT,
  monthly_budget DECIMAL(10,2),
  per_meal_budget DECIMAL(10,2),
  subscription_tier TEXT CHECK (subscription_tier IN ('standard', 'premium', 'enterprise')) DEFAULT 'standard',
  monthly_fee DECIMAL(10,2) DEFAULT 299.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on corporate_accounts
ALTER TABLE public.corporate_accounts ENABLE ROW LEVEL SECURITY;

-- Corporate accounts policies
CREATE POLICY "Corporate admins can view their own accounts"
  ON public.corporate_accounts FOR SELECT
  USING (auth.uid() = admin_id OR public.has_role(auth.uid(), 'corporate_admin'));

CREATE POLICY "Corporate admins can update their own accounts"
  ON public.corporate_accounts FOR UPDATE
  USING (auth.uid() = admin_id);

CREATE POLICY "Super admins can manage all corporate accounts"
  ON public.corporate_accounts FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Create corporate_team_members table
CREATE TABLE public.corporate_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_account_id UUID REFERENCES public.corporate_accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  per_meal_budget DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(corporate_account_id, user_id)
);

-- Enable RLS on corporate_team_members
ALTER TABLE public.corporate_team_members ENABLE ROW LEVEL SECURITY;

-- Corporate team members policies
CREATE POLICY "Team members can view their own membership"
  ON public.corporate_team_members FOR SELECT
  USING (auth.uid() = user_id);

-- Create wine_database table
CREATE TABLE public.wine_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  winery TEXT NOT NULL,
  vintage INTEGER,
  region TEXT,
  country TEXT,
  wine_type TEXT CHECK (wine_type IN ('red', 'white', 'sparkling', 'rose', 'dessert')),
  grape_varieties TEXT[],
  alcohol_content DECIMAL(4,2),
  bottle_size TEXT DEFAULT '750ml',
  market_price_estimate DECIMAL(10,2),
  critic_score INTEGER CHECK (critic_score BETWEEN 0 AND 100),
  description TEXT,
  image_url TEXT,
  vivino_id TEXT,
  wine_searcher_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on wine_database
ALTER TABLE public.wine_database ENABLE ROW LEVEL SECURITY;

-- Wine database policies
CREATE POLICY "Anyone can view wines"
  ON public.wine_database FOR SELECT
  USING (TRUE);

CREATE POLICY "Restaurant partners can add wines"
  ON public.wine_database FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'restaurant_partner') OR public.has_role(auth.uid(), 'super_admin'));

-- Create restaurant_wines table
CREATE TABLE public.restaurant_wines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  wine_id UUID REFERENCES public.wine_database(id) ON DELETE CASCADE,
  current_price DECIMAL(10,2) NOT NULL,
  by_glass_price DECIMAL(10,2),
  is_available BOOLEAN DEFAULT TRUE,
  section TEXT,
  notes TEXT,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, wine_id)
);

-- Enable RLS on restaurant_wines
ALTER TABLE public.restaurant_wines ENABLE ROW LEVEL SECURITY;

-- Restaurant wines policies
CREATE POLICY "Anyone can view available restaurant wines"
  ON public.restaurant_wines FOR SELECT
  USING (is_available = TRUE);

CREATE POLICY "Restaurant owners can manage their wines"
  ON public.restaurant_wines FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

-- Create pre_orders table
CREATE TABLE public.pre_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_account_id UUID REFERENCES public.corporate_accounts(id) ON DELETE CASCADE,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
  ordered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  dinner_date TIMESTAMP WITH TIME ZONE NOT NULL,
  num_guests INTEGER NOT NULL,
  total_budget DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on pre_orders
ALTER TABLE public.pre_orders ENABLE ROW LEVEL SECURITY;

-- Pre-orders policies
CREATE POLICY "Corporate users can view their orders"
  ON public.pre_orders FOR SELECT
  USING (
    auth.uid() = ordered_by OR
    EXISTS (
      SELECT 1 FROM public.corporate_accounts
      WHERE id = corporate_account_id AND admin_id = auth.uid()
    )
  );

CREATE POLICY "Corporate admins can create pre-orders"
  ON public.pre_orders FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'corporate_admin') AND
    EXISTS (
      SELECT 1 FROM public.corporate_accounts
      WHERE id = corporate_account_id AND admin_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can view their pre-orders"
  ON public.pre_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update pre-order status"
  ON public.pre_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants
      WHERE id = restaurant_id AND owner_id = auth.uid()
    )
  );

-- Create pre_order_wines table
CREATE TABLE public.pre_order_wines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pre_order_id UUID REFERENCES public.pre_orders(id) ON DELETE CASCADE,
  wine_id UUID REFERENCES public.wine_database(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_per_bottle DECIMAL(10,2) NOT NULL,
  notes TEXT
);

-- Enable RLS on pre_order_wines
ALTER TABLE public.pre_order_wines ENABLE ROW LEVEL SECURITY;

-- Pre-order wines policies
CREATE POLICY "Users can view wines in their pre-orders"
  ON public.pre_order_wines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pre_orders
      WHERE id = pre_order_id AND (
        ordered_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.corporate_accounts
          WHERE id = pre_orders.corporate_account_id AND admin_id = auth.uid()
        ) OR
        EXISTS (
          SELECT 1 FROM public.restaurants
          WHERE id = pre_orders.restaurant_id AND owner_id = auth.uid()
        )
      )
    )
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_corporate_accounts_updated_at BEFORE UPDATE ON public.corporate_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wine_database_updated_at BEFORE UPDATE ON public.wine_database
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_wines_updated_at BEFORE UPDATE ON public.restaurant_wines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pre_orders_updated_at BEFORE UPDATE ON public.pre_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  
  -- Default role is consumer
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'consumer');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();