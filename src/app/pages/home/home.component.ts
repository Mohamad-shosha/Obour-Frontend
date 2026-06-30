// src/app/pages/home/home.component.ts
import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CountUp } from 'countup.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private statsObserver!: IntersectionObserver;
  private cardObserver!: IntersectionObserver;
  private visibleCards: HTMLElement[] = [];
  private isScrollScheduled = false;
  heroRotateX = 8;
  heroRotateY = -12;
  isIntroAnimating = true;

  // Showcase Active State
  activeShowcaseIndex = 0;

  // Career Filter State
  selectedCareerCategory = 'all';

  constructor(private router: Router) { }

  ngAfterViewInit() {
    this.initScrollAnimations();
    this.initStatsCountUp();
    
    // Disable intro animation after entrance show completes
    setTimeout(() => {
      this.isIntroAnimating = false;
    }, 2200);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.statsObserver) {
      this.statsObserver.disconnect();
    }
    if (this.cardObserver) {
      this.cardObserver.disconnect();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    // Hero Mockup 3D Tilt calculation
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation (-8 to 8 degrees) based on cursor position
    const rotateY = ((mouseX / windowWidth) - 0.5) * 16;
    const rotateX = ((mouseY / windowHeight) - 0.5) * -16;
    
    // Apply easing by interpolating with current values for smooth feel
    this.heroRotateX = this.heroRotateX + (rotateX - this.heroRotateX) * 0.1;
    this.heroRotateY = this.heroRotateY + (rotateY - this.heroRotateY) * 0.1;

    // Spotlight Effect for grids
    const gridItems = document.querySelectorAll('.spotlight-card') as NodeListOf<HTMLElement>;
    gridItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  initScrollAnimations() {
    // Support both standard scroll-animate and newly introduced fade-up-view/scale-up-view
    const animatedElements = document.querySelectorAll(
      '.scroll-animate:not(.visible), .fade-up-view:not(.visible), .scale-up-view:not(.visible), .slide-left-view:not(.visible), .slide-right-view:not(.visible)'
    );
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );
    animatedElements.forEach((el) => this.observer.observe(el));

    // Observe cards in viewport to apply smooth 3D scroll tilt
    const cards = document.querySelectorAll('.card-premium, .card, .spotlight-card, .showcase-tab, .career-explorer-card, .ai-assistant-card, .showcase-display-window');
    this.cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            if (!this.visibleCards.includes(target)) {
              this.visibleCards.push(target);
            }
          } else {
            this.visibleCards = this.visibleCards.filter((c) => c !== target);
            target.style.removeProperty('--scroll-rotate-x');
            target.style.removeProperty('--scroll-translate-y');
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '100px 0px 100px 0px',
      }
    );
    cards.forEach((c) => this.cardObserver.observe(c));
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.isScrollScheduled) return;
    this.isScrollScheduled = true;

    window.requestAnimationFrame(() => {
      const windowHeight = window.innerHeight;
      const viewportCenter = windowHeight / 2;
      const scrollY = window.scrollY;

      // 1. 3D Parallax floating effect for glowing orbs in Hero Background
      const orbs = document.querySelectorAll('.hero-mesh .orb') as NodeListOf<HTMLElement>;
      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.15;
        const offset = scrollY * speed;
        orb.style.transform = `translateY(${offset}px)`;
      });

      // 2. 3D Scroll Rotation & Depth translate for Hero Mockup Window
      const heroMockup = document.querySelector('.mockup-glass') as HTMLElement;
      if (heroMockup && scrollY < 800) {
        const scrollRotateX = (scrollY / 800) * 15; // Max 15 degrees extra tilt
        const scrollTranslateZ = (scrollY / 800) * -150; // Max 150px push back in Z depth
        heroMockup.style.setProperty('--scroll-hero-rx', `${scrollRotateX}deg`);
        heroMockup.style.setProperty('--scroll-hero-tz', `${scrollTranslateZ}px`);
      }

      // 3. 3D Parallax tilt calculations for all visible card elements
      this.visibleCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distanceFromCenter = (cardCenter - viewportCenter) / (windowHeight / 2);

        // Calculate smooth 3D tilt based on card depth in view
        const rotateX = distanceFromCenter * 6; // Max 6 degrees tilt
        const translateY = distanceFromCenter * -12; // Max 12px vertical drift

        card.style.setProperty('--scroll-rotate-x', `${rotateX}deg`);
        card.style.setProperty('--scroll-translate-y', `${translateY}px`);
      });

      this.isScrollScheduled = false;
    });
  }

  initStatsCountUp() {
    const statsSection = document.querySelector('.stats-container-section');
    if (!statsSection) return;

    this.statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.runCountUp();
            this.statsObserver.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    this.statsObserver.observe(statsSection);
  }

  runCountUp() {
    const elements = document.querySelectorAll('.stat-count-value');
    elements.forEach((el) => {
      const targetVal = parseFloat(el.getAttribute('data-target') || '0');
      const isPercent = el.getAttribute('data-percent') === 'true';
      const isPlus = el.getAttribute('data-plus') === 'true';
      
      const options = {
        startVal: 0,
        duration: 2.2,
        useEasing: true,
        useGrouping: true,
        suffix: isPercent ? '%' : (isPlus ? '+' : '')
      };
      
      const countUpObj = new CountUp(el as HTMLElement, targetVal, options);
      if (!countUpObj.error) {
        countUpObj.start();
      } else {
        console.error(countUpObj.error);
      }
    });
  }

  startEvaluation(): void {
    this.router.navigate(['/evaluation']);
  }

  startAbout(): void {
    this.router.navigate(['/about']);
  }

  setActiveFeature(index: number) {
    this.activeShowcaseIndex = index;
  }

  // --- البيانات المحدثة والتفاعلية ---

  // 1. Showcase Features
  showcaseFeatures = [
    {
      title: 'التقييم الأكاديمي الشامل',
      description: 'تحليل دقيق ومفصل لمستوى المعرفة الأكاديمية في مجالات التخصص الأساسية من خلال اختبارات تفاعلية ذكية تقيس مدى الفهم والتطبيق الفعلي للعلوم التخصصية.',
      icon: 'fa-graduation-cap',
      previewType: 'academic',
      badge: 'الجانب المعرفي',
      stats: { progress: 85, score: 92, questions: 40, duration: '60 دقيقة' }
    },
    {
      title: 'التقييم النفسي والسلوكي',
      description: 'قياس المهارات الشخصية الناعمة والذكاء العاطفي مثل العمل الجماعي، التواصل، والتكيف السلوكي لضمان التوافق التام مع متطلبات بيئة العمل الحديثة.',
      icon: 'fa-brain',
      previewType: 'psychological',
      badge: 'المهارات الشخصية',
      metrics: [
         { label: 'العمل الجماعي وتنسيق الجهود', value: 92 },
         { label: 'التواصل الفعال وبناء العلاقات', value: 88 },
         { label: 'حل المشكلات والتفكير الإبداعي', value: 80 },
         { label: 'القيادة وإدارة المهام وتوجيهها', value: 85 }
      ]
    },
    {
      title: 'التوصيات الذكية بالذكاء الاصطناعي',
      description: 'تحليل فوري وشخصي لنتائج تقييماتك يقدمه محرك الذكاء الاصطناعي لدينا، يحدد بدقة نقاط القوة وفرص التطوير مع اقتراح مسارات تدريبية مخصصة لسد الفجوات.',
      icon: 'fa-robot',
      previewType: 'ai-recommendations',
      badge: 'ذكاء اصطناعي',
      recommendations: [
         'تطوير مهارات تطوير الويب باستخدام أطر عمل متطورة مثل Angular.',
         'التركيز على مهارات إدارة قواعد البيانات الكبيرة وتنظيم وهيكلة البيانات.',
         'المشاركة في دورات إدارة المشاريع التنموية لبناء حس القيادة والعمل الجماعي.'
      ]
    },
    {
      title: 'التوجيه والإرشاد المهني',
      description: 'تحديد المهن والمسارات الوظيفية الأكثر ملاءمة لقدراتك واهتماماتك وتزويدك بخارطة طريق واضحة وقابلة للقياس للانتقال بنجاح لسوق العمل.',
      icon: 'fa-compass',
      badge: 'الإرشاد المهني',
      previewType: 'career',
      paths: [
         { role: 'مهندس برمجيات (Software Engineer)', match: '96%' },
         { role: 'محلل بيانات وتطبيقات (Data Analyst)', match: '89%' },
         { role: 'مهندس واجهات ومصمم تجربة (UI/UX)', match: '92%' }
      ]
    },
    {
      title: 'مؤشر جاهزية الطالب العام',
      description: 'مقياس رقمي معتمد وموحد يمثل جاهزيتك الإجمالية للانخراط في التدريب التعاوني والميداني والوظائف المتاحة في السوق بناءً على كل تقييماتك بالمنصة.',
      icon: 'fa-chart-pie',
      badge: 'مؤشر الجاهزية',
      previewType: 'readiness',
      score: 87
    }
  ];

  // 2. Careers Data
  careers = [
    {
      title: 'مهندس برمجيات (Software Engineer)',
      category: 'tech',
      demand: 'مرتفع جداً',
      compatibility: '94%',
      description: 'تصميم وبناء وصيانة النظم البرمجية وتطبيقات الويب والخدمات السحابية باستخدام أحدث التقنيات وأطر العمل.',
      skills: ['Angular', 'Spring Boot', 'TypeScript', 'Docker', 'REST API'],
      color: '#3B82F6'
    },
    {
      title: 'محلل بيانات (Data Analyst)',
      category: 'tech',
      demand: 'مرتفع جداً',
      compatibility: '88%',
      description: 'تحليل البيانات الضخمة، واستخلاص المعلومات الإحصائية، وتقديم لوحات تحكم تفاعلية لاتخاذ قرارات استراتيجية.',
      skills: ['Python', 'SQL', 'Power BI', 'Excel', 'Data Mining'],
      color: '#8B5CF6'
    },
    {
      title: 'مهندس أمن سيبراني (Cybersecurity Engineer)',
      category: 'tech',
      demand: 'مرتفع',
      compatibility: '82%',
      description: 'حماية البنية التحتية، الشبكات، والأنظمة من الاختراقات الأمنية وتصميم دفاعات أمنية وحلول حماية استباقية.',
      skills: ['Firewalls', 'Network Security', 'Penetration Testing', 'Linux'],
      color: '#EF4444'
    },
    {
      title: 'مطور واجهات المستخدم (UI/UX Developer)',
      category: 'tech',
      demand: 'مرتفع',
      compatibility: '91%',
      description: 'تحويل التصاميم التفاعلية لرمز برمجي عالي الأداء مع التركيز التام على تجربة المستخدم وسرعة استجابة الصفحات.',
      skills: ['HTML5/CSS3', 'Sass', 'JavaScript', 'Figma', 'Responsive Design'],
      color: '#0EA5E9'
    },
    {
      title: 'محلل مالي واستثماري (Financial Analyst)',
      category: 'business',
      demand: 'متوسط',
      compatibility: '85%',
      description: 'دراسة البيانات المالية للمؤسسات لتقديم توصيات استثمارية حكيمة، وإدارة المخاطر وبناء توقعات النمو المستقبلية.',
      skills: ['Financial Modeling', 'Corporate Finance', 'Excel', 'Valuation'],
      color: '#F59E0B'
    },
    {
      title: 'أخصائي موارد بشرية (HR Specialist)',
      category: 'business',
      demand: 'متوسط',
      compatibility: '78%',
      description: 'تنظيم عمليات الاستقطاب والتوظيف، برامج التطوير المهني والتدريب للموظفين، وتنسيق الأداء لبيئة عمل ممتازة.',
      skills: ['Recruitment', 'Communication', 'Labor Law', 'Performance Management'],
      color: '#10B981'
    }
  ];
  filteredCareers = [...this.careers];

  filterCareers(category: string) {
    this.selectedCareerCategory = category;
    if (category === 'all') {
      this.filteredCareers = this.careers;
    } else {
      this.filteredCareers = this.careers.filter((c) => c.category === category);
    }
  }

  // 3. AI Assistant Preview Data & typing simulation
  chatMessages: { sender: 'user' | 'ai'; text: string; time: string; typing?: boolean }[] = [
    {
      sender: 'ai',
      text: 'مرحباً! أنا المساعد الذكي لمستشار المهن لمنصة عبور. كيف يمكنني مساعدتك اليوم في استكشاف جاهزيتك للتدريب والبحث عن مسار وظيفي؟',
      time: '10:00 ص',
    },
  ];
  chatPrompts = [
    'كيف أرفع مؤشر جاهزيتي للتدريب؟',
    'ما المهارات المطلوبة لوظيفة مهندس البرمجيات؟',
    'ما هي التخصصات المهنية الأكثر توافقاً معي؟',
  ];
  isTyping = false;

  sendPrompt(promptText: string) {
    if (this.isTyping) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    this.chatMessages.push({ sender: 'user', text: promptText, time: timeStr });

    this.isTyping = true;
    const typingMsgIndex = this.chatMessages.length;
    this.chatMessages.push({ sender: 'ai', text: '', time: timeStr, typing: true });

    setTimeout(() => {
      const responseText = this.getAIResponse(promptText);
      this.chatMessages.splice(typingMsgIndex, 1); // remove typing
      this.isTyping = false;
      this.typeText(responseText, timeStr);
    }, 1200);
  }

  typeText(fullText: string, timeStr: string) {
    let currentText = '';
    let charIndex = 0;
    const newMessage = { sender: 'ai' as const, text: '', time: timeStr };
    this.chatMessages.push(newMessage);
    const msgIndex = this.chatMessages.length - 1;

    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        currentText += fullText[charIndex];
        this.chatMessages[msgIndex].text = currentText;
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 15); // Fast fluid typing animation
  }

  getAIResponse(prompt: string): string {
    if (prompt.includes('جاهزيتي')) {
      return 'لزيادة مؤشر جاهزيتك للتدريب التعاوني والميداني، نوصيك أولاً بإكمال جميع الاختبارات الأكاديمية والمهارات السلوكية. بعد ذلك، قم بسد الثغرات المحددة عبر دورات مقترحة في صفحة التوصيات بالمنصة.';
    } else if (prompt.includes('مهندس')) {
      return 'هندسة البرمجيات تتطلب إتقاناً للغات كـ JavaScript/TypeScript مع أطر العمل الحديثة (Angular)، مهارات كتابة الكود النظيف، تصميم أنظمة قواعد البيانات، ومعرفة بأساسيات DevOps وDocker.';
    } else if (prompt.includes('توافقاً')) {
      return 'بناءً على نتائج تحليل منصة عبور التقييمي حتى الآن، مسارك الأنسب هو هندسة البرمجيات وتطوير الويب بمعدل توافق 96%، يليه تحليل البيانات الذكية بمعدل توافق 89%.';
    }
    return 'أنا هنا لمساعدتك في أي وقت بخصوص مسارك المهني أو استفسارك حول نتائج تقييمك!';
  }

  // --- البيانات الأساسية الأخرى ---
  stats = [
    {
      title: 'الجامعات المشاركة',
      value: 45,
      icon: 'fa-building-columns',
      description: 'جامعة حكومية وخاصة',
      plus: true
    },
    {
      title: 'التخصصات المغطاة',
      value: 120,
      icon: 'fa-book-open',
      description: 'تخصص أكاديمي متنوع',
      plus: true
    },
    {
      title: 'الطلبة المستفيدين',
      value: 25000,
      icon: 'fa-users',
      description: 'طالب وطالبة مستفيدين',
      plus: true
    },
    {
      title: 'معدل التحسن والجاهزية',
      value: 87,
      icon: 'fa-chart-line',
      description: 'في الجاهزية للتدريب وسوق العمل',
      percent: true
    },
  ];

  vision2030 = [
    'بناء جيل مؤهل ومنافس عالمياً من الكوادر الوطنية الشابة',
    'تحقيق التميز والجودة في التعليم والتدريب التعاوني والميداني',
    'تعزيز التعاون والشراكات المثمرة بين الجامعات وقطاعات التوظيف',
    'رفع نسب التوظيف المباشر للخريجين في القطاعات المستهدفة',
    'تطوير وتحديث المهارات المستقبلية الأكثر طلباً في سوق العمل'
  ];

  partners = [
    { name: 'جامعة الملك سعود', logo: 'fa-building-columns' },
    { name: 'جامعة الملك عبدالعزيز', logo: 'fa-graduation-cap' },
    { name: 'جامعة الإمام محمد بن سعود', logo: 'fa-book' },
    { name: 'جامعة أم القرى', logo: 'fa-mosque' },
    { name: 'جامعة الملك فهد', logo: 'fa-microscope' },
    { name: 'وزارة التعليم', logo: 'fa-school' },
    { name: 'جامعة طيبة', logo: 'fa-book-open-reader' }
  ];

  testimonials = [
    {
      content: 'أحدثت هذه المنصة نقلة نوعية في كفاءة التنبؤ بمستوى جاهزية الخريجين قبل الالتحاق بالتدريب الميداني. دقة التقييم ساعدتنا كمرشدين وأكاديميين بشكل ملحوظ.',
      author: 'د. أحمد عبدالله',
      role: 'عميد كلية الهندسة والعلوم التطبيقية',
      avatar: 'fa-user-tie'
    },
    {
      content: 'تجربتي مع منصة عبور كانت تفاعلية وممتازة. بفضل المؤشر والتوصيات الذكية، عرفت نقاط القوة التي أمتلكها وركزت على سد فجواتي المهارية لأدخل سوق العمل بكل ثقة.',
      author: 'سارة خالد',
      role: 'طالبة خريجة - هندسة برمجيات',
      avatar: 'fa-user-graduate'
    },
    {
      content: 'التقارير المفصلة التي توفرها المنصة تختصر الكثير من الوقت والجهد على المرشدين المهنيين لتوجيه الطلبة نحو المسار المهني الأنسب لقدراتهم النفسية والمعرفية.',
      author: 'أ. محمد العتيبي',
      role: 'مرشد أكاديمي ومهني',
      avatar: 'fa-user-clock'
    }
  ];
}

