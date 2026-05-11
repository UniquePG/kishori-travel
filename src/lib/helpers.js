import { Facebook, Globe, Instagram, Mail, MessageCircle, Phone, Store, Target, Users } from "lucide-react";

export  const getSourceIcon = (source) => {
    switch (source) {
      case "website":
        return <Globe className="h-3 w-3" />;
      case "referral":
        return <Users className="h-3 w-3" />;
      case "instagram":
        return <Instagram className="h-3 w-3" />;
      case "facebook":
        return <Facebook className="h-3 w-3" />;
      case "whatsapp":
        return <MessageCircle className="h-3 w-3" />;
      case "walk_in":
        return <Store className="h-3 w-3" />;
      case "phone":
        return <Phone className="h-3 w-3" />;
      case "email":
        return <Mail className="h-3 w-3" />;
      case "other":
      default:
        return <Target className="h-3 w-3" />;
    }
  };