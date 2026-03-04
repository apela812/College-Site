import { create } from 'zustand';

export type Language = 'ru' | 'en' | 'tt';

interface I18nStore {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionary = {
  ru: {
    'nav.home': 'Главная',
    'nav.about': 'О колледже',
    'nav.applicants': 'Абитуриентам',
    'nav.students': 'Студентам',
    'nav.news': 'Новости',
    'hero.title': 'Альметьевский Медицинский Колледж',
    'hero.subtitle': 'Традиции милосердия, инновации в образовании. Станьте профессионалом в медицине вместе с нами.',
    'hero.cta': 'Поступить к нам',
    'hero.secondary': 'Узнать больше',
    'stats.students': 'Студентов',
    'stats.programs': 'Образовательных программ',
    'stats.graduates': 'Выпускников ежегодно',
    'about.title': 'О нашем колледже',
    'about.desc': 'Мы готовим высококвалифицированных специалистов среднего звена для системы здравоохранения Республики Татарстан и всей России.',
    'news.latest': 'Последние новости',
    'news.all': 'Все новости',
    'news.readMore': 'Читать далее',
    'news.add': 'Добавить новость',
    'news.empty': 'Новостей пока нет',
    'applicants.title': 'Абитуриентам',
    'applicants.programs': 'Специальности',
    'students.title': 'Студентам',
    'students.schedule': 'Расписание занятий',
    'form.create': 'Создать',
    'form.cancel': 'Отмена',
    'theme.toggle': 'Переключить тему'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.applicants': 'Applicants',
    'nav.students': 'Students',
    'nav.news': 'News',
    'hero.title': 'Almetyevsk Medical College',
    'hero.subtitle': 'Traditions of mercy, innovations in education. Become a medical professional with us.',
    'hero.cta': 'Apply Now',
    'hero.secondary': 'Learn More',
    'stats.students': 'Students',
    'stats.programs': 'Programs',
    'stats.graduates': 'Annual Graduates',
    'about.title': 'About Our College',
    'about.desc': 'We train highly qualified mid-level specialists for the healthcare system of the Republic of Tatarstan and all of Russia.',
    'news.latest': 'Latest News',
    'news.all': 'All News',
    'news.readMore': 'Read More',
    'news.add': 'Add News',
    'news.empty': 'No news yet',
    'applicants.title': 'For Applicants',
    'applicants.programs': 'Specialties',
    'students.title': 'For Students',
    'students.schedule': 'Class Schedule',
    'form.create': 'Create',
    'form.cancel': 'Cancel',
    'theme.toggle': 'Toggle theme'
  },
  tt: {
    'nav.home': 'Төп бит',
    'nav.about': 'Көллият турында',
    'nav.applicants': 'Абитуриентларга',
    'nav.students': 'Студентларга',
    'nav.news': 'Яңалыклар',
    'hero.title': 'Әлмәт Медицина Көллияте',
    'hero.subtitle': 'Мәрхәмәтлелек традицияләре, мәгарифтә инновацияләр. Безнең белән медицина профессионалы булыгыз.',
    'hero.cta': 'Укырга керергә',
    'hero.secondary': 'Күбрәк белергә',
    'stats.students': 'Студентлар',
    'stats.programs': 'Белем бирү программалары',
    'stats.graduates': 'Ел саен чыгарылыш',
    'about.title': 'Безнең көллият турында',
    'about.desc': 'Без Татарстан Республикасы һәм бөтен Россия сәламәтлек саклау системасы өчен югары квалификацияле урта звено белгечләре әзерлибез.',
    'news.latest': 'Соңгы яңалыклар',
    'news.all': 'Барлык яңалыклар',
    'news.readMore': 'Дәвамын укырга',
    'news.add': 'Яңалык өстәү',
    'news.empty': 'Әлегә яңалыклар юк',
    'applicants.title': 'Абитуриентларга',
    'applicants.programs': 'Белгечлекләр',
    'students.title': 'Студентларга',
    'students.schedule': 'Дәресләр расписаниесе',
    'form.create': 'Төзү',
    'form.cancel': 'Баш тарту',
    'theme.toggle': 'Теманы үзгәртү'
  }
};

export const useI18n = create<I18nStore>((set, get) => ({
  lang: 'ru',
  setLang: (lang) => set({ lang }),
  t: (key) => {
    const { lang } = get();
    // @ts-ignore
    return dictionary[lang][key] || key;
  }
}));

export function getLocalizedField<T extends Record<string, any>>(
  obj: T | undefined | null, 
  baseField: string, 
  lang: Language
): string {
  if (!obj) return '';
  const suffix = lang.charAt(0).toUpperCase() + lang.slice(1);
  const fieldName = `${baseField}${suffix}`;
  return obj[fieldName as keyof T] as string || '';
}
