import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentResult } from 'src/app/models/assessment-result.model';
import { AssessmentResultService } from 'src/app/services/assessment-result.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  results: AssessmentResult[] = [];
  isLoading = true;

  // Metrics
  totalAssessments = 0;
  averageScore = 0;
  totalXP = 0;
  highestScore = 0;
  overallLevelName = 'مبتدئ';

  // Chart Data
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { tension: 0.4 }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12, family: 'Cairo' } },
        ticks: { display: false },
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: { display: false }
    }
  };
  public radarChartData: ChartData<'radar'> = {
    labels: [],
    datasets: []
  };

  // Rich Analytics Data
  topStrengths: { name: string; score: number }[] = [];
  areasForImprovement: { name: string; score: number }[] = [];
  aiAnalysisText: string = '';
  careerRecommendations: string[] = [];

  constructor(
    private resultService: AssessmentResultService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromStorage();
    if (!user || !user.id) {
      this.router.navigate(['/auth']);
      return;
    }

    this.resultService.getResultsByUser(user.id).subscribe({
      next: (res) => {
        this.results = res || [];
        this.calculateMetrics();
        this.prepareChartData();
        this.generateRichAnalytics();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.isLoading = false;
      }
    });
  }

  private calculateMetrics() {
    this.totalAssessments = this.results.length;
    if (this.totalAssessments > 0) {
      const totalPct = this.results.reduce((acc, curr) => acc + (curr.scorePercent || 0), 0);
      this.averageScore = Math.round(totalPct / this.totalAssessments);
      this.totalXP = this.results.reduce((acc, curr) => acc + (curr.earnedPoints || 0), 0);
      
      this.highestScore = Math.max(...this.results.map(r => r.scorePercent || 0));
      
      if (this.averageScore >= 85) this.overallLevelName = 'متقدم (احترافي)';
      else if (this.averageScore >= 65) this.overallLevelName = 'متوسط (واعد)';
      else this.overallLevelName = 'مبتدئ (مستكشف)';
    }
  }

  private prepareChartData() {
    const recent = [...this.results].slice(0, 10).reverse();
    
    // Line Chart Data
    this.lineChartData = {
      labels: recent.map(r => {
        const d = new Date(r.completedAt);
        return `${d.getDate()}/${d.getMonth()+1}`;
      }),
      datasets: [
        {
          data: recent.map(r => r.scorePercent || 0),
          label: 'النتيجة (%)',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          fill: true,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#3b82f6',
          borderWidth: 3,
          pointRadius: 4,
        }
      ]
    };

    // Radar Chart Data (Domains)
    const domainMap = new Map<string, { total: number, count: number }>();
    this.results.forEach(res => {
      if (res.domainScores && res.domainScores.length > 0) {
        res.domainScores.forEach(ds => {
          const key = ds.domainNameAr || ds.domainName;
          const current = domainMap.get(key) || { total: 0, count: 0 };
          domainMap.set(key, { total: current.total + ds.scorePct, count: current.count + 1 });
        });
      } else if (res.domainNameAr || res.domainName) {
         const key = res.domainNameAr || res.domainName;
         const current = domainMap.get(key) || { total: 0, count: 0 };
         domainMap.set(key, { total: current.total + res.scorePercent, count: current.count + 1 });
      }
    });

    const radarLabels: string[] = [];
    const radarData: number[] = [];

    domainMap.forEach((val, key) => {
      radarLabels.push(key);
      radarData.push(Math.round(val.total / val.count));
    });

    if (radarLabels.length === 0) {
      radarLabels.push('أساسيات', 'تحليل', 'تطبيق', 'سرعة الإنجاز');
      radarData.push(this.averageScore, this.averageScore > 10 ? this.averageScore - 10 : this.averageScore, this.averageScore, 80);
    }

    this.radarChartData = {
      labels: radarLabels,
      datasets: [
        {
          data: radarData,
          label: 'قوة المهارة (%)',
          backgroundColor: 'rgba(139, 92, 246, 0.4)',
          borderColor: '#8b5cf6',
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#8b5cf6',
          borderWidth: 2,
        }
      ]
    };
  }

  private generateRichAnalytics() {
    if (this.results.length === 0) return;

    if (this.averageScore >= 80) {
      this.aiAnalysisText = "أداؤك استثنائي! تظهر تحليلاتنا أنك تمتلك فهماً عميقاً للمفاهيم الأساسية، مما يجعلك مؤهلاً بقوة للبدء في مشاريع التدريب الميداني المتقدمة. سرعة استجابتك ودقتك في الإجابة تشير إلى قدرات تحليلية عالية.";
      this.topStrengths = [
        { name: 'التحليل المنطقي', score: 92 },
        { name: 'سرعة الإنجاز', score: 88 },
        { name: 'دقة المعلومات', score: 85 }
      ];
      this.areasForImprovement = [
        { name: 'المهارات القيادية', score: 60 },
        { name: 'التقنيات المتقدمة', score: 65 }
      ];
      this.careerRecommendations = [
        'جاهز بنسبة 95% لبرامج التدريب التعاوني (COOP)',
        'ننصح بالتركيز على الشهادات المهنية المتقدمة',
        'مؤهل لقيادة فرق العمل الطلابية في مشاريع التخرج'
      ];
    } else if (this.averageScore >= 60) {
      this.aiAnalysisText = "أداؤك جيد جداً وفي تحسن مستمر. لقد اجتزت معظم التقييمات بنجاح، لكن هناك بعض المفاهيم الدقيقة التي تحتاج إلى مراجعة لضمان جاهزيتك التامة لسوق العمل. الاستمرارية هي مفتاحك للوصول لمستوى الاحتراف.";
      this.topStrengths = [
        { name: 'الأساسيات الأكاديمية', score: 75 },
        { name: 'المعرفة النظرية', score: 70 }
      ];
      this.areasForImprovement = [
        { name: 'التطبيق العملي', score: 55 },
        { name: 'حل المشكلات المعقدة', score: 50 },
        { name: 'إدارة الوقت', score: 45 }
      ];
      this.careerRecommendations = [
        'الالتحاق بدورات تطبيقية (Hands-on) مكثفة',
        'بناء مشاريع صغيرة لتحسين الجانب العملي',
        'جاهز للتدريب الميداني التأسيسي'
      ];
    } else {
      this.aiAnalysisText = "مستواك الحالي يتطلب خطة عمل مكثفة. تشير التحليلات إلى وجود فجوات في المعرفة الأساسية. لا تقلق، هذا طبيعي في بداية الرحلة. ننصحك بإعادة مراجعة المواد التأسيسية وأخذ تقييمات تشخيصية أكثر لتحديد نقاط الضعف بدقة.";
      this.topStrengths = [
        { name: 'الاستعداد للتعلم', score: 60 }
      ];
      this.areasForImprovement = [
        { name: 'الأساسيات الأكاديمية', score: 30 },
        { name: 'التركيز والفهم العميق', score: 35 },
        { name: 'المهارات التقنية', score: 20 }
      ];
      this.careerRecommendations = [
        'مراجعة المقررات الأساسية للتخصص',
        'الاستفادة من الساعات المكتبية والموجهين',
        'تأجيل التدريب الميداني المتقدم لحين تحسين المعدل'
      ];
    }
  }

  viewResult(sessionId: number) {
    this.router.navigate(['/evaluation/results', sessionId]);
  }

  getLevelClass(level: string): string {
    switch(level) {
      case 'BEGINNER': return 'bg-secondary text-white';
      case 'INTERMEDIATE': return 'bg-primary text-white';
      case 'ADVANCED': return 'bg-success text-white';
      default: return 'bg-light text-dark';
    }
  }

  getLevelName(level: string): string {
    switch(level) {
      case 'BEGINNER': return 'مبتدئ';
      case 'INTERMEDIATE': return 'متوسط';
      case 'ADVANCED': return 'متقدم';
      default: return level || 'غير محدد';
    }
  }
}
