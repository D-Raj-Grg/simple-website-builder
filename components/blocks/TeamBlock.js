'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Plus, 
  X, 
  Upload,
  Edit3,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Mail,
  Users
} from "lucide-react";
import useEditorStore from '@/lib/store/editorStore';
import Image from 'next/image';

export default function TeamBlock({ content, settings, isEditing, blockId }) {
  const [isEditingText, setIsEditingText] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
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

  const addMember = () => {
    const newMember = {
      id: Date.now().toString(),
      name: 'New Team Member',
      role: 'Position',
      photo: '/mock/team/placeholder.jpg',
      bio: 'Add bio here...',
      social: {
        linkedin: '',
        twitter: '',
        email: ''
      }
    };
    handleContentChange('members', [...members, newMember]);
  };

  const removeMember = (memberId) => {
    handleContentChange('members', members.filter(member => member.id !== memberId));
  };

  const updateMember = (memberId, key, value) => {
    const updatedMembers = members.map(member =>
      member.id === memberId ? { ...member, [key]: value } : member
    );
    handleContentChange('members', updatedMembers);
  };

  const updateMemberSocial = (memberId, platform, value) => {
    const updatedMembers = members.map(member =>
      member.id === memberId 
        ? { ...member, social: { ...member.social, [platform]: value } }
        : member
    );
    handleContentChange('members', updatedMembers);
  };

  const {
    columns = 3,
    cardStyle = 'simple',
    showSocial = true,
    showBio = true
  } = settings;

  const {
    heading = 'Meet Our Team',
    description = 'The talented people behind our success',
    members = [
      {
        id: '1',
        name: 'Alex Rodriguez',
        role: 'Founder & CEO',
        photo: '/mock/team/person1.jpg',
        bio: 'Passionate entrepreneur with 15+ years in tech.',
        social: { linkedin: '#', twitter: '#', email: 'alex@company.com' }
      },
      {
        id: '2',
        name: 'Emma Thompson',
        role: 'Head of Design',
        photo: '/mock/team/person2.jpg',
        bio: 'Award-winning designer focused on user experience.',
        social: { linkedin: '#', dribbble: '#', email: 'emma@company.com' }
      },
      {
        id: '3',
        name: 'David Kim',
        role: 'Lead Developer',
        photo: '/mock/team/person3.jpg',
        bio: 'Full-stack developer passionate about clean code.',
        social: { linkedin: '#', github: '#', email: 'david@company.com' }
      }
    ]
  } = content;

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  };

  const cardStyleClasses = {
    simple: 'border-0 shadow-none bg-transparent',
    elevated: 'shadow-lg hover:shadow-xl',
    outlined: 'border border-gray-200 hover:border-gray-300 shadow-none'
  };

  const getSocialIcon = (platform) => {
    const icons = {
      linkedin: Linkedin,
      twitter: Twitter,
      github: Github,
      dribbble: Globe,
      email: Mail,
      website: Globe
    };
    return icons[platform] || Globe;
  };

  const renderMemberCard = (member, index) => (
    <Card key={member.id} className={`${cardStyleClasses[cardStyle]} group transition-all duration-200`}>
      <CardContent className="p-6 text-center">
        {/* Photo */}
        <div className="relative w-32 h-32 mx-auto mb-4 group/photo">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Photo Upload Overlay */}
          {isEditing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover/photo:opacity-100 transition-opacity rounded-full flex items-center justify-center cursor-pointer">
              <Upload className="h-6 w-6 text-white" />
            </div>
          )}

          {/* Remove Member Button */}
          {isEditing && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeMember(member.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Name */}
        {isEditing && editingMember === `${member.id}-name` ? (
          <Input
            value={member.name}
            onChange={(e) => updateMember(member.id, 'name', e.target.value)}
            onBlur={() => setEditingMember(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setEditingMember(null);
            }}
            className="text-xl font-semibold text-center border-2 border-blue-500 mb-2"
            autoFocus
          />
        ) : (
          <h3 
            className={`text-xl font-semibold text-gray-900 mb-2 ${
              isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
            }`}
            onClick={() => isEditing && setEditingMember(`${member.id}-name`)}
          >
            {member.name}
          </h3>
        )}

        {/* Role */}
        {isEditing && editingMember === `${member.id}-role` ? (
          <Input
            value={member.role}
            onChange={(e) => updateMember(member.id, 'role', e.target.value)}
            onBlur={() => setEditingMember(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setEditingMember(null);
            }}
            className="text-center border-2 border-blue-500 mb-4"
            autoFocus
          />
        ) : (
          <p 
            className={`text-blue-600 font-medium mb-4 ${
              isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
            }`}
            onClick={() => isEditing && setEditingMember(`${member.id}-role`)}
          >
            {member.role}
          </p>
        )}

        {/* Bio */}
        {showBio && member.bio && (
          <>
            {isEditing && editingMember === `${member.id}-bio` ? (
              <Textarea
                value={member.bio}
                onChange={(e) => updateMember(member.id, 'bio', e.target.value)}
                onBlur={() => setEditingMember(null)}
                className="text-sm text-center border-2 border-blue-500 resize-none mb-4"
                rows={3}
                autoFocus
              />
            ) : (
              <p 
                className={`text-sm text-gray-600 mb-4 ${
                  isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
                }`}
                onClick={() => isEditing && setEditingMember(`${member.id}-bio`)}
              >
                {member.bio}
              </p>
            )}
          </>
        )}

        {/* Social Links */}
        {showSocial && member.social && (
          <div className="flex justify-center space-x-3">
            {Object.entries(member.social).map(([platform, url]) => {
              if (!url) return null;
              
              const IconComponent = getSocialIcon(platform);
              
              return (
                <Button
                  key={platform}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  onClick={() => !isEditing && url !== '#' && window.open(url, '_blank')}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
            
            {/* Add Social Link Button */}
            {isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-gray-300"
                onClick={() => setEditingMember(`${member.id}-social`)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <section className="py-16 px-6 md:px-8 bg-white">
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
            <Input
              value={description}
              onChange={(e) => handleContentChange('description', e.target.value)}
              onBlur={(e) => {
                handleContentChange('description', e.target.value);
                setIsEditingText(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleContentChange('description', e.target.value);
                  setIsEditingText(null);
                }
              }}
              className="text-lg border-2 border-blue-500 bg-white text-center"
              autoFocus
            />
          ) : (
            <p 
              className={`text-lg text-gray-600 max-w-2xl mx-auto ${
                isEditing ? 'cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors' : ''
              }`}
              onClick={() => isEditing && setIsEditingText('description')}
            >
              {description}
            </p>
          )}
        </div>

        {/* Team Grid */}
        {members.length === 0 && isEditing ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members Yet</h3>
            <p className="text-gray-500 mb-4">Add team members to showcase your team</p>
            <Button onClick={addMember}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Member
            </Button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${columnClasses[columns]} gap-8`}>
            {members.map(renderMemberCard)}
            
            {/* Add Member Button */}
            {isEditing && (
              <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-96">
                  <Button 
                    variant="ghost" 
                    className="flex-col gap-3 h-auto p-6 text-gray-500 hover:text-blue-600"
                    onClick={addMember}
                  >
                    <Users className="h-12 w-12" />
                    <div>
                      <div className="font-medium">Add Team Member</div>
                      <div className="text-sm text-gray-400">Click to add a new team member</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Editing helper */}
      {isEditing && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white text-xs px-3 py-2 rounded-md shadow-lg z-50">
          Team Section • Click text to edit • Upload photos • Manage social links
        </div>
      )}
    </section>
  );
}