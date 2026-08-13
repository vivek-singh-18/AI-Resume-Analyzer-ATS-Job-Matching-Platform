import React, { useState, useEffect } from "react";
import {
  User,
  Key,
  Mail,
  Calendar,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
} from "lucide-react";
import useProfileStore from "@/stores/useProfileStore";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const {
    user,
    activeProvider,
    apiKey,
    isLoading,
    fetchProfile,
    setApiKey,
    clearApiKey,
  } = useProfileStore();

  useDocumentTitle("Profile | AI Document Analyzer");

  // fetch profile on mount
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Local UI state kept minimal: only what's necessary for editing/viewing
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProvider, setTempProvider] = useState(activeProvider || "openai");
  const [tempKey, setTempKey] = useState("");

  // API Provider configurations
  const providers = [
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT-4 and other OpenAI models",
      docsUrl: "https://platform.openai.com/api-keys",
      placeholder: "sk-proj-...",
    },
    {
      id: "claude",
      name: "Claude (Anthropic)",
      description: "Claude 3 Opus, Sonnet, and Haiku",
      docsUrl: "https://console.anthropic.com/",
      placeholder: "sk-ant-...",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Gemini Pro and Ultra models",
      docsUrl: "https://makersuite.google.com/app/apikey",
      placeholder: "AIza...",
    },
  ];

  const handleSaveKey = () => {
    if (!tempKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    // Basic validation for key format
    if (tempKey.length < 10) {
      toast.error("API key seems too short. Please check and try again.");
      return;
    }

    // Persist via store which calls updateProfile
    setApiKey(tempProvider, tempKey);
    setIsEditing(false);
    setTempKey("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempProvider(activeProvider || user?.preferredAI || "openai");
    setTempKey(apiKey || "");
  };

  const handleRemove = () => {
    clearApiKey();
    setIsEditing(false);
    setTempKey("");
    setTempProvider("openai");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempKey("");
    setTempProvider(activeProvider || "openai");
  };

  const maskApiKey = (key) => {
    if (!key) return "";
    if (key.length <= 8) return "••••••••";
    return key.substring(0, 4) + "••••••••" + key.substring(key.length - 4);
  };

  const hasApiKey = !!apiKey;

  // show skeleton while loading
  if (!user && isLoading) {
    return <Skeleton className="h-8 w-1/3 mb-4" />;
  }

  return (
    <div className="min-h-screen max-w-6xl w-full py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-sm text-gray-600">
            Manage your account information and API configuration
          </p>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gray-100 p-2 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Account Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{user?.name}</span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{user?.email}</span>
              </div>
            </div>

            {/* Join Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Member Since
              </label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* API Key Configuration Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Key className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                API Key Configuration
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Configure your preferred AI provider (only one provider allowed)
              </p>
            </div>
          </div>

          {/* Active Provider Notice */}
          {hasApiKey && !isEditing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    Active Provider:{" "}
                    {providers.find((p) => p.id === activeProvider)?.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    This provider will be used for all document analysis
                    requests
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Configuration Form */}
          <div className="space-y-4">
            {isEditing || !hasApiKey ? (
              <div className="space-y-4">
                {/* Provider Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select AI Provider
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setTempProvider(provider.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          tempProvider === provider.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {provider.name}
                          </h3>
                          {tempProvider === provider.id && (
                            <Check className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {provider.description}
                        </p>
                        <a
                          href={provider.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs text-blue-600 hover:text-blue-700 mt-2 inline-flex items-center gap-1"
                        >
                          Get API Key <ExternalLink className="w-3 h-3" />
                        </a>
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={user?.aiKeys || tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder={
                      providers.find((p) => p.id === tempProvider)?.placeholder
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    Your API key will be encrypted and stored securely.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveKey}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Configuration
                  </button>
                  {hasApiKey && (
                    <button
                      onClick={handleCancel}
                      className="px-4 py-3 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Display Current Configuration */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Current Provider
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {providers.find((p) => p.id === activeProvider)?.name}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      Active
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">API Key</p>
                    <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg">
                      <code className="flex-1 text-sm text-gray-700 font-mono">
                        {showKey ? apiKey : maskApiKey(apiKey)}
                      </code>
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleEdit}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Change Provider / Edit Key
                  </button>
                  <button
                    onClick={handleRemove}
                    className="px-4 py-3 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Remove Key
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
