
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/use-analytics';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useUserPreferences, WinePreferences } from '@/hooks/useUserPreferences';

// Wine varietals and regions data
const wineVarietals = [
  'Cabernet Sauvignon', 'Pinot Noir', 'Chardonnay', 'Merlot', 
  'Syrah', 'Sauvignon Blanc', 'Riesling', 'Malbec', 'Zinfandel',
  'Grenache', 'Tempranillo', 'Sangiovese', 'Nebbiolo'
];

const wineRegions = [
  'Bordeaux (France)', 'Burgundy (France)', 'Napa Valley (USA)', 'Tuscany (Italy)', 
  'Barossa Valley (Australia)', 'Piedmont (Italy)', 'Rioja (Spain)', 
  'Champagne (France)', 'Sonoma (USA)', 'Willamette Valley (USA)',
  'Russian River Valley (USA)', 'Mosel (Germany)', 'Mendoza (Argentina)', 
  'Marlborough (New Zealand)'
];

// Form schema
const formSchema = z.object({
  favoriteVarietals: z.array(z.string()).default([]),
  preferredRegions: z.array(z.string()).default([]),
  sweetness: z.number().min(1).max(5),
  acidity: z.number().min(1).max(5),
  tannin: z.number().min(1).max(5),
  body: z.number().min(1).max(5),
  priceMin: z.number().min(0),
  priceMax: z.number().min(0),
  allergies: z.string().optional(),
});

const PreferencesForm: React.FC = () => {
  const { preferences, updatePreferences, setHasSetPreferences } = useUserPreferences();
  const { logEvent, EventType } = useAnalytics();
  
  // Initialize form with current preferences
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      favoriteVarietals: preferences.favoriteVarietals,
      preferredRegions: preferences.preferredRegions,
      sweetness: preferences.tasteProfile.sweetness,
      acidity: preferences.tasteProfile.acidity,
      tannin: preferences.tasteProfile.tannin,
      body: preferences.tasteProfile.body,
      priceMin: preferences.priceRange.min,
      priceMax: preferences.priceRange.max,
      allergies: preferences.allergies.join(', '),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Transform form values to preferences format
    const newPreferences: Partial<WinePreferences> = {
      favoriteVarietals: values.favoriteVarietals,
      preferredRegions: values.preferredRegions,
      tasteProfile: {
        sweetness: values.sweetness,
        acidity: values.acidity,
        tannin: values.tannin,
        body: values.body,
      },
      priceRange: {
        min: values.priceMin,
        max: values.priceMax,
      },
      allergies: values.allergies ? values.allergies.split(',').map(item => item.trim()) : [],
    };
    
    // Update preferences
    updatePreferences(newPreferences);
    setHasSetPreferences(true);
    
    // Track analytics
    logEvent(EventType.PREFERENCES_UPDATE, { 
      varietals: values.favoriteVarietals.length,
      regions: values.preferredRegions.length 
    });
    
    // Show success message
    toast.success('Wine preferences saved!');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your Wine Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Tell us about your wine preferences so we can personalize your experience.
          </p>
        </div>

        {/* Favorite Varietals */}
        <FormField
          control={form.control}
          name="favoriteVarietals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Wine Varietals</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (!field.value.includes(value)) {
                    field.onChange([...field.value, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select favorite varietals" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wineVarietals.map((varietal) => (
                    <SelectItem key={varietal} value={varietal}>
                      {varietal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((varietal) => (
                  <div 
                    key={varietal} 
                    className="bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    <span>{varietal}</span>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(field.value.filter(v => v !== varietal));
                      }}
                      className="text-primary/70 hover:text-primary"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <FormDescription>
                Select wine varietals you enjoy
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preferred Regions */}
        <FormField
          control={form.control}
          name="preferredRegions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Wine Regions</FormLabel>
              <Select
                onValueChange={(value) => {
                  if (!field.value.includes(value)) {
                    field.onChange([...field.value, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred regions" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {wineRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((region) => (
                  <div 
                    key={region} 
                    className="bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    <span>{region}</span>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(field.value.filter(r => r !== region));
                      }}
                      className="text-primary/70 hover:text-primary"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <FormDescription>
                Select wine regions you prefer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Taste Profile - Sweetness */}
        <FormField
          control={form.control}
          name="sweetness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sweetness Preference</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Dry</span>
                    <span>Medium</span>
                    <span>Sweet</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                How sweet do you prefer your wines?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Taste Profile - Acidity */}
        <FormField
          control={form.control}
          name="acidity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acidity Preference</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                How acidic do you prefer your wines?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Taste Profile - Tannin */}
        <FormField
          control={form.control}
          name="tannin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tannin Preference</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Soft</span>
                    <span>Medium</span>
                    <span>Firm</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                How tannic do you prefer your wines?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Taste Profile - Body */}
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body Preference</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Light</span>
                    <span>Medium</span>
                    <span>Full</span>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                How full-bodied do you prefer your wines?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priceMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priceMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Allergies */}
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allergies or Restrictions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., sulfites, egg white fining agents"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                List any allergies or dietary restrictions (separate with commas)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Save Preferences</Button>
      </form>
    </Form>
  );
};

export default PreferencesForm;
