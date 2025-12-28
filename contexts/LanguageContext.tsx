"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "vi" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "nav.posts": "Posts",
    "nav.topics": "Topics",
    "nav.practice": "Practice",
    "nav.about": "About",
    "nav.search": "Search...",
    "topics.title": "Security Topics",
    "hero.title": "Security Research & Writeups",
    "hero.subtitle":
      "Exploring vulnerabilities, sharing knowledge, and securing the web.",
    "hero.browsePosts": "Browse Posts",
    "hero.aboutMe": "About Me",
    "latest.posts": "Latest Posts",
    "home.viewAll": "View all",
    "read.more": "Read More",
    "footer.rights": "All rights reserved.",
    "footer.builtBy": "Built by",
    "footer.sourceCode": "The source code is available on",
    "cve.info": "CVE & Basic Info",
    "cve.id": "CVE ID",
    "cve.type": "Vulnerability Type",
    "cve.affected": "Affected Versions",
    "cve.patched": "Patched Versions",
    "cve.severity": "CVSS Severity",
    "cve.product": "Product",
    "meta.admin": "Admin",
    "meta.draft": "Draft",
    "meta.read": "min read",
    "meta.views": "views",
    "meta.comments": "comments",
    "related.posts": "Related Posts",
    tags: "Tags",
    comments: "Comments",
    "comments.login": "Please login to comment",
    "comments.placeholder": "Write a comment...",
    "comments.submit": "Post Comment",
    "comments.submitting": "Posting...",
    "comments.name": "Name",
    "comments.namePlaceholder": "Your name",
    "comments.content": "Comment",
    "comments.contentPlaceholder": "Share your thoughts...",
    "comments.noComments":
      "No comments yet. Be the first to share your thoughts!",
    "resume.experience": "Experience",
    "resume.education": "Education",
    "resume.skills": "Skills",
    "resume.projects": "Projects",
    "resume.certifications": "Certifications",
    "resume.awards": "Awards",
    "about.me": "About Me",
  },
  vi: {
    "nav.posts": "Bài viết",
    "nav.topics": "Chủ đề",
    "nav.practice": "Thực hành",
    "nav.about": "Giới thiệu",
    "nav.search": "Tìm kiếm...",
    "topics.title": "Chủ đề Bảo mật",
    "hero.title": "Nghiên cứu Bảo mật & Writeups",
    "hero.subtitle":
      "Khám phá lỗ hổng, chia sẻ kiến thức và bảo vệ môi trường mạng.",
    "hero.browsePosts": "Xem bài viết",
    "hero.aboutMe": "Về tôi",
    "latest.posts": "Bài viết mới nhất",
    "home.viewAll": "Xem tất cả",
    "read.more": "Đọc thêm",
    "footer.rights": "Đã đăng ký bản quyền.",
    "footer.builtBy": "Được xây dựng bởi",
    "footer.sourceCode": "Mã nguồn có sẵn trên",
    "cve.info": "Thông tin CVE & Cơ bản",
    "cve.id": "Mã CVE",
    "cve.type": "Loại lỗ hổng",
    "cve.affected": "Phiên bản bị ảnh hưởng",
    "cve.patched": "Phiên bản đã vá",
    "cve.severity": "Mức độ nghiêm trọng",
    "cve.product": "Sản phẩm",
    "meta.admin": "Quản trị viên",
    "meta.draft": "Bản nháp",
    "meta.read": "phút đọc",
    "meta.views": "lượt xem",
    "meta.comments": "bình luận",
    "related.posts": "Bài viết liên quan",
    tags: "Thẻ",
    comments: "Bình luận",
    "comments.login": "Vui lòng đăng nhập để bình luận",
    "comments.placeholder": "Viết bình luận...",
    "comments.submit": "Đăng bình luận",
    "comments.submitting": "Đang đăng...",
    "comments.name": "Tên",
    "comments.namePlaceholder": "Tên của bạn",
    "comments.content": "Bình luận",
    "comments.contentPlaceholder": "Chia sẻ suy nghĩ của bạn...",
    "comments.noComments":
      "Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ suy nghĩ của bạn!",
    "resume.experience": "Kinh nghiệm",
    "resume.education": "Học vấn",
    "resume.skills": "Kỹ năng",
    "resume.projects": "Dự án",
    "resume.certifications": "Chứng chỉ",
    "resume.awards": "Giải thưởng",
    "about.me": "Về tôi",
  },
  zh: {
    "nav.posts": "文章",
    "nav.topics": "话题",
    "nav.practice": "实践",
    "nav.about": "关于",
    "nav.search": "搜索...",
    "topics.title": "安全话题",
    "hero.title": "安全研究与文章",
    "hero.subtitle": "探索漏洞，分享知识，保护网络安全。",
    "hero.browsePosts": "浏览文章",
    "hero.aboutMe": "关于我",
    "latest.posts": "最新文章",
    "home.viewAll": "查看全部",
    "read.more": "阅读更多",
    "footer.rights": "版权所有。",
    "footer.builtBy": "由",
    "footer.sourceCode": "源代码可在",
    "cve.info": "CVE & 基本信息",
    "cve.id": "CVE 编号",
    "cve.type": "漏洞类型",
    "cve.affected": "受影响版本",
    "cve.patched": "已修复版本",
    "cve.severity": "CVSS 严重程度",
    "cve.product": "产品",
    "meta.admin": "管理员",
    "meta.draft": "草稿",
    "meta.read": "分钟阅读",
    "meta.views": "次浏览",
    "meta.comments": "条评论",
    "related.posts": "相关文章",
    tags: "标签",
    comments: "评论",
    "comments.login": "请登录后评论",
    "comments.placeholder": "写下你的评论...",
    "comments.submit": "发表评论",
    "comments.submitting": "发布中...",
    "comments.name": "姓名",
    "comments.namePlaceholder": "你的名字",
    "comments.content": "评论",
    "comments.contentPlaceholder": "分享你的想法...",
    "comments.noComments": "暂无评论。成为第一个分享想法的人！",
    "resume.experience": "工作经历",
    "resume.education": "教育背景",
    "resume.skills": "技能",
    "resume.projects": "项目",
    "resume.certifications": "证书",
    "resume.awards": "奖项",
    "about.me": "关于我",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && ["en", "vi", "zh"].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string) => {
    return (
      translations[language][key as keyof (typeof translations)["en"]] || key
    );
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
