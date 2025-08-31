'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star,
  Zap,
  Crown,
  Shield,
  Plus,
  X
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';

export default function PricingBlock({ content, settings, isEditing, blockId }) {
  const [isEditingText, setIsEditingText] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const { updateBlock, currentLanguage } = useEditorStore();

  const handleContentChange = (key, value) => {
    updateBlock(blockId, {
      content: {
        ...content,
        [currentLanguage]: {
          ...content,
          [key]: value
        }
      }
    });
  };

  const handlePlanChange = (planIndex, key, value) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex] = { ...updatedPlans[planIndex], [key]: value };
    handleContentChange('plans', updatedPlans);
  };

  const addFeatureToPlan = (planIndex) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features.push('New feature');
    handleContentChange('plans', updatedPlans);
  };

  const removeFeatureFromPlan = (planIndex, featureIndex) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features.splice(featureIndex, 1);
    handleContentChange('plans', updatedPlans);
  };

  const updateFeature = (planIndex, featureIndex, value) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features[featureIndex] = value;
    handleContentChange('plans', updatedPlans);
  };

  const {
    planCount = 3,
    highlightPlan = 1,
    currency = '$',
    billingPeriod = 'month'
  } = settings;

  const {
    heading = 'Choose Your Plan',
    description = 'Select the perfect plan for your business needs',
    plans = [
      {
        name: 'Starter',
        price: '9',
        originalPrice: null,
        description: 'Perfect for small businesses',
        features: ['5 Products', 'Basic Analytics', 'Email Support'],
        cta: 'Get Started',
        popular: false
      },
      {
        name: 'Professional',
        price: '29',
        originalPrice: '39',
        description: 'Best for growing businesses',
        features: ['Unlimited Products', 'Advanced Analytics', 'Priority Support', 'Custom Domain'],
        cta: 'Start Free Trial',
        popular: true
      },
      {
        name: 'Enterprise',
        price: '99',
        originalPrice: null,
        description: 'For large organizations',
        features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Manager', 'SLA Guarantee'],
        cta: 'Contact Sales',
        popular: false
      }
    ].slice(0, planCount)
  } = content;

  const getPlanIcon = (index) => {
    const icons = [Shield, Zap, Crown];
    const IconComponent = icons[index] || Star;
    return IconComponent;
  };

  const renderPricingCard = (plan, index) => {
    const isHighlighted = index === highlightPlan;
    const IconComponent = getPlanIcon(index);

    return (
      <Card 
        key={index}
        className={`relative transition-all duration-200 ${
          isHighlighted 
            ? 'ring-2 ring-blue-500 shadow-xl scale-105 z-10' 
            : 'shadow-lg hover:shadow-xl'
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-600 text-white px-4 py-1">
              <Star className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${
              isHighlighted ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <IconComponent className="h-6 w-6" />
            </div>
          </div>

          {isEditing && editingPlan === `${index}-name` ? (
            <Input
              value={plan.name}
              onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
              onBlur={() => setEditingPlan(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingPlan(null);
              }}
              className="text-xl font-bold text-center border-2 border-blue-500"
              autoFocus
            />
          ) : (
            <h3 
              className={`text-xl font-bold text-gray-900 mb-2 ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setEditingPlan(`${index}-name`)}
            >
              {plan.name}
            </h3>
          )}

          {isEditing && editingPlan === `${index}-description` ? (
            <Input
              value={plan.description}
              onChange={(e) => handlePlanChange(index, 'description', e.target.value)}
              onBlur={() => setEditingPlan(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingPlan(null);
              }}
              className="text-center border-2 border-blue-500"
              autoFocus
            />
          ) : (
            <p 
              className={`text-gray-600 ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setEditingPlan(`${index}-description`)}
            >
              {plan.description}
            </p>
          )}

          <div className="mt-6">
            <div className="flex items-baseline justify-center">
              <span className="text-sm text-gray-500">{currency}</span>
              
              {isEditing && editingPlan === `${index}-price` ? (
                <Input
                  value={plan.price}
                  onChange={(e) => handlePlanChange(index, 'price', e.target.value)}
                  onBlur={() => setEditingPlan(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setEditingPlan(null);
                  }}
                  className="text-4xl font-bold w-24 text-center border-2 border-blue-500 mx-1"
                  autoFocus
                />
              ) : (
                <span 
                  className={`text-4xl font-bold text-gray-900 mx-1 ${
                    isEditing ? 'cursor-pointer hover:bg-blue-50 px-2 py-1 rounded transition-colors' : ''
                  }`}
                  onClick={() => isEditing && setEditingPlan(`${index}-price`)}
                >
                  {plan.price}
                </span>
              )}
              
              <span className="text-sm text-gray-500">/{billingPeriod}</span>
            </div>
            
            {plan.originalPrice && (
              <p className="text-sm text-gray-500 line-through mt-1">
                {currency}{plan.originalPrice}/{billingPeriod}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                
                {isEditing && editingPlan === `${index}-feature-${featureIndex}` ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                      onBlur={() => setEditingPlan(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingPlan(null);
                      }}
                      className="text-sm border-2 border-blue-500"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:bg-red-50"
                      onClick={() => removeFeatureFromPlan(index, featureIndex)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <span 
                    className={`text-sm text-gray-700 flex-1 ${
                      isEditing ? 'cursor-pointer hover:bg-blue-50 p-1 rounded transition-colors' : ''
                    }`}
                    onClick={() => isEditing && setEditingPlan(`${index}-feature-${featureIndex}`)}
                  >
                    {feature}
                  </span>
                )}
              </li>
            ))}
            
            {isEditing && (
              <li>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50 h-8"
                  onClick={() => addFeatureToPlan(index)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Feature
                </Button>
              </li>
            )}
          </ul>

          {isEditing && editingPlan === `${index}-cta` ? (
            <Input
              value={plan.cta}
              onChange={(e) => handlePlanChange(index, 'cta', e.target.value)}
              onBlur={() => setEditingPlan(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setEditingPlan(null);
              }}
              className="border-2 border-blue-500"
              autoFocus
            />
          ) : (
            <Button 
              className={`w-full ${
                isHighlighted 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-900 hover:bg-gray-800'
              } ${isEditing ? 'cursor-pointer' : ''}`}
              size="lg"
              onClick={() => isEditing && setEditingPlan(`${index}-cta`)}
            >
              {plan.cta}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-16 px-6 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          {isEditing && isEditingText === 'heading' ? (
            <Input
              value={heading}
              onChange={(e) => handleContentChange('heading', e.target.value)}
              onBlur={(e) => {
                handleContentChange('heading', e.target.value);
                setIsEditingText(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleContentChange('heading', e.target.value);
                  setIsEditingText(null);
                }
              }}
              className="text-3xl font-bold border-2 border-blue-500 bg-white text-center"
              autoFocus
            />
          ) : (
            <h2 
              className={`text-3xl md:text-4xl font-bold text-gray-900 mb-4 ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('heading')}
            >
              {heading}
            </h2>
          )}

          {isEditing && isEditingText === 'description' ? (
            <Textarea
              value={description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              onBlur={(e) => {
                handleContentChange('description', e.target.value);
                setIsEditingText(null);
              }}
              className="text-xl border-2 border-blue-500 bg-white resize-none text-center"
              rows={2}
              autoFocus
            />
          ) : (
            <p 
              className={`text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('description')}
            >
              {description}
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className={`grid gap-6 grid-cols-1 ${
          planCount === 2 ? 'sm:grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
          planCount === 3 ? 'sm:grid-cols-1 lg:grid-cols-3 max-w-6xl mx-auto' :
          'sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-auto'
        }`}>
          {plans.map(renderPricingCard)}
        </div>

        {/* Money-back guarantee */}
        {!isEditing && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200">
              <Shield className="h-4 w-4 text-green-500" />
              30-day money-back guarantee
            </div>
          </div>
        )}
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Pricing • Click text to edit • Use settings to adjust plans
        </div>
      )}
    </section>
  );
}