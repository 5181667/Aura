// MBTI 代表人物图片映射
// 将中文人名映射到图片路径

export interface FamousPerson {
    name: string        // 中文名称
    image: string       // 图片路径
}

export const famousPeopleImages: Record<string, FamousPerson[]> = {
    'INTJ': [
        { name: '埃隆·马斯克', image: '/famous-people/INTJ/Elon_Musk_0.jpg' },
        { name: '克里斯托弗·诺兰', image: '/famous-people/INTJ/Christopher_Nolan_0.jpg' },
        { name: '尼采', image: '/famous-people/INTJ/Friedrich_Nietzsche_0.jpg' }
    ],
    'INTP': [
        { name: '爱因斯坦', image: '/famous-people/INTP/Albert_Einstein_0.jpg' },
        { name: '比尔·盖茨', image: '/famous-people/INTP/Bill_Gates_0.jpg' },
        { name: '牛顿', image: '/famous-people/INTP/Isaac_Newton_0.jpg' }
    ],
    'ENTJ': [
        { name: '史蒂夫·乔布斯', image: '/famous-people/ENTJ/Steve_Jobs_0.jpg' },
        { name: '戈登·拉姆齐', image: '/famous-people/ENTJ/Gordon_Ramsay_0.jpg' },
        { name: '玛格丽特·撒切尔', image: '/famous-people/ENTJ/Margaret_Thatcher_0.jpg' }
    ],
    'ENTP': [
        { name: '托马斯·爱迪生', image: '/famous-people/ENTP/Thomas_Edison_0.jpg' },
        { name: '马克·吐温', image: '/famous-people/ENTP/Mark_Twain_0.jpg' },
        { name: '小罗伯特·唐尼', image: '/famous-people/ENTP/Robert_Downey_Jr_0.jpg' }
    ],
    'INFJ': [
        { name: '马丁·路德·金', image: '/famous-people/INFJ/Martin_Luther_King_Jr_0.jpg' },
        { name: '纳尔逊·曼德拉', image: '/famous-people/INFJ/Nelson_Mandela_0.jpg' },
        { name: '宫崎骏', image: '/famous-people/INFJ/Hayao_Miyazaki_0.jpg' }
    ],
    'INFP': [
        { name: '威廉·莎士比亚', image: '/famous-people/INFP/William_Shakespeare_0.jpg' },
        { name: '约翰尼·德普', image: '/famous-people/INFP/Johnny_Depp_0.jpg' },
        { name: '托尔金', image: '/famous-people/INFP/J.R.R._Tolkien_0.jpg' }
    ],
    'ENFJ': [
        { name: '奥巴马', image: '/famous-people/ENFJ/Barack_Obama_0.jpg' },
        { name: '奥普拉', image: '/famous-people/ENFJ/Oprah_Winfrey_0.jpg' },
        { name: '詹妮弗·劳伦斯', image: '/famous-people/ENFJ/Jennifer_Lawrence_0.jpg' }
    ],
    'ENFP': [
        { name: '罗宾·威廉姆斯', image: '/famous-people/ENFP/Robin_Williams_0.jpg' },
        { name: '威尔·史密斯', image: '/famous-people/ENFP/Will_Smith_0.jpg' },
        { name: '华特·迪士尼', image: '/famous-people/ENFP/Walt_Disney_0.jpg' }
    ],
    'ISTJ': [
        { name: '乔治·华盛顿', image: '/famous-people/ISTJ/George_Washington_0.jpg' },
        { name: '沃伦·巴菲特', image: '/famous-people/ISTJ/Warren_Buffett_0.jpg' },
        { name: '娜塔莉·波特曼', image: '/famous-people/ISTJ/Natalie_Portman_0.jpg' }
    ],
    'ISFJ': [
        { name: '伊丽莎白二世', image: '/famous-people/ISFJ/Queen_Elizabeth_II_0.jpg' },
        { name: '碧昂丝', image: '/famous-people/ISFJ/Beyonce_0.jpg' },
        { name: '安妮·海瑟薇', image: '/famous-people/ISFJ/Anne_Hathaway_0.jpg' }
    ],
    'ESTJ': [
        { name: '约翰·D·洛克菲勒', image: '/famous-people/ESTJ/John_D._Rockefeller_0.jpg' },
        { name: '艾玛·沃特森', image: '/famous-people/ESTJ/Emma_Watson_0.jpg' },
        { name: '弗兰克·辛纳屈', image: '/famous-people/ESTJ/Frank_Sinatra_0.jpg' }
    ],
    'ESFJ': [
        { name: '泰勒·斯威夫特', image: '/famous-people/ESFJ/Taylor_Swift_0.jpg' },
        { name: '詹妮弗·洛佩兹', image: '/famous-people/ESFJ/Jennifer_Lopez_0.jpg' },
        { name: '比尔·克林顿', image: '/famous-people/ESFJ/Bill_Clinton_0.jpg' }
    ],
    'ISTP': [
        { name: '迈克尔·乔丹', image: '/famous-people/ISTP/Michael_Jordan_0.jpg' },
        { name: '汤姆·克鲁斯', image: '/famous-people/ISTP/Tom_Cruise_0.jpg' },
        { name: '李小龙', image: '/famous-people/ISTP/Bruce_Lee_0.jpg' }
    ],
    'ISFP': [
        { name: '迈克尔·杰克逊', image: '/famous-people/ISFP/Michael_Jackson_0.jpg' },
        { name: '大卫·贝克汉姆', image: '/famous-people/ISFP/David_Beckham_0.jpg' },
        { name: '布兰妮·斯皮尔斯', image: '/famous-people/ISFP/Britney_Spears_0.jpg' }
    ],
    'ESTP': [
        { name: '唐纳德·特朗普', image: '/famous-people/ESTP/Donald_Trump_0.jpg' },
        { name: '麦当娜', image: '/famous-people/ESTP/Madonna_0.jpg' },
        { name: '欧内斯特·海明威', image: '/famous-people/ESTP/Ernest_Hemingway_0.jpg' }
    ],
    'ESFP': [
        { name: '玛丽莲·梦露', image: '/famous-people/ESFP/Marilyn_Monroe_0.jpg' },
        { name: '猫王', image: '/famous-people/ESFP/Elvis_Presley_0.jpg' },
        { name: '阿黛尔', image: '/famous-people/ESFP/Adele_0.jpg' }
    ]
}

// 根据 MBTI 类型获取代表人物图片
export function getFamousPeopleByType(type: string): FamousPerson[] {
    const baseType = type.toUpperCase().replace(/-[AT]$/, '')
    return famousPeopleImages[baseType] || []
}
