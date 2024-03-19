import { Country } from '../models/common.model';

export const COUNTRY_CODE = [
  {
    name: 'Bahamas',
    code: 'BS',
    dialCode: '+1242',
  },
  {
    name: 'Albania',
    code: 'AL',
    dialCode: '+355',
  },
  {
    name: 'Myanmar ',
    code: 'MM',
    dialCode: '+95',
  },
  {
    name: 'Burundi',
    code: 'BI',
    dialCode: '+257',
  },
  {
    name: 'Cambodia',
    code: 'KH',
    dialCode: '+855',
  },
  {
    name: 'Algeria',
    code: 'DZ',
    dialCode: '+213',
  },
  // {
  //   name: 'Canada',
  //   code: 'CA',
  //   dialCode: '+1',
  // },
  {
    name: 'Cabo Verde',
    code: 'CV',
    dialCode: '+238',
  },
  {
    name: 'Cayman Islands',
    code: 'KY',
    dialCode: '+1345',
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
    dialCode: '+94',
  },
  {
    name: 'Chile',
    code: 'CL',
    dialCode: '+56',
  },
  {
    name: 'China',
    code: 'CN',
    dialCode: '+86',
  },
  {
    name: 'Colombia',
    code: 'CO',
    dialCode: '+57',
  },
  {
    name: 'Comoros',
    code: 'KM',
    dialCode: '+269',
  },
  {
    name: 'Costa Rica',
    code: 'CR',
    dialCode: '+506',
  },
  {
    name: 'Croatia',
    code: 'HR',
    dialCode: '+385',
  },
  {
    name: 'Cyprus',
    code: 'CY',
    dialCode: '+357',
  },
  {
    name: 'Benin',
    code: 'BJ',
    dialCode: '+229',
  },
  {
    name: 'Greece',
    code: 'GR',
    dialCode: '+30',
  },
  {
    name: 'Estonia',
    code: 'EE',
    dialCode: '+372',
  },
  {
    name: 'Dominica',
    code: 'DM',
    dialCode: '+1767',
  },
  {
    name: 'Ecuador',
    code: 'EC',
    dialCode: '+593',
  },
  {
    name: 'Equatorial Guinea',
    code: 'GQ',
    dialCode: '+240',
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    dialCode: '+251',
  },
  {
    name: 'Faroe Islands',
    code: 'FO',
    dialCode: '+298',
  },
  {
    name: 'Falkland Islands [Malvinas]',
    code: 'FK',
    dialCode: '+500',
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    code: 'GS',
    dialCode: '+500',
  },
  {
    name: 'French Polynesia',
    code: 'PF',
    dialCode: '+689',
  },
  {
    name: 'Georgia',
    code: 'GE',
    dialCode: '+995',
  },
  {
    name: 'Ghana',
    code: 'GH',
    dialCode: '+233',
  },
  {
    name: 'Argentina',
    code: 'AR',
    dialCode: '+54',
  },
  {
    name: 'Guam',
    code: 'GU',
    dialCode: '+1671',
  },
  {
    name: 'Guatemala',
    code: 'GT',
    dialCode: '+502',
  },
  {
    name: 'Guinea',
    code: 'GN',
    dialCode: '+224',
  },
  {
    name: 'Guyana',
    code: 'GY',
    dialCode: '+592',
  },
  {
    name: 'Heard Island and McDonald Islands',
    code: 'HM',
    dialCode: '+6723',
  },
  {
    name: 'Honduras',
    code: 'HN',
    dialCode: '+504',
  },
  {
    name: 'Hungary',
    code: 'HU',
    dialCode: '+36',
  },
  {
    name: 'Iceland',
    code: 'IS',
    dialCode: '+354',
  },
  {
    name: 'Hong Kong',
    code: 'HK',
    dialCode: '+852',
  },
  {
    name: 'Namibia',
    code: 'NA',
    dialCode: '+264',
  },
  {
    name: 'Gibraltar',
    code: 'GI',
    dialCode: '+350',
  },
  {
    name: 'Haiti',
    code: 'HT',
    dialCode: '+509',
  },
  {
    name: 'Australia',
    code: 'AU',
    dialCode: '+61',
  },
  {
    name: 'Cocos (Keeling) Islands',
    code: 'CC',
    dialCode: '+6189162',
  },
  {
    name: 'Christmas Island',
    code: 'CX',
    dialCode: '+6189164',
  },
  {
    name: 'Niue',
    code: 'NU',
    dialCode: '+683',
  },
  {
    name: 'India',
    code: 'IN',
    dialCode: '+91',
  },
  {
    name: 'Indonesia',
    code: 'ID',
    dialCode: '+62',
  },
  {
    name: 'Iran (Islamic Republic of)',
    code: 'IR',
    dialCode: '+98',
  },
  {
    name: 'Ireland',
    code: 'IE',
    dialCode: '+353',
  },
  {
    name: 'Ivory Coast',
    code: 'CI',
    dialCode: '+225',
  },
  {
    name: 'Jamaica',
    code: 'JM',
    dialCode: '+1876',
  },
  {
    name: 'Japan',
    code: 'JP',
    dialCode: '+81',
  },
  {
    name: 'Gambia',
    code: 'GM',
    dialCode: '+220',
  },
  {
    name: 'Kazakhstan',
    code: 'KZ',
    dialCode: '+76',
  },
  {
    name: 'Jordan',
    code: 'JO',
    dialCode: '+962',
  },
  {
    name: 'Kenya',
    code: 'KE',
    dialCode: '+254',
  },
  {
    name: "Korea (the Democratic People's Republic of)",
    code: 'KP',
    dialCode: '+850',
  },
  {
    name: 'Korea (the Republic of)',
    code: 'KR',
    dialCode: '+82',
  },
  {
    name: 'Kuwait',
    code: 'KW',
    dialCode: '+965',
  },
  {
    name: 'Kyrgyzstan',
    code: 'KG',
    dialCode: '+996',
  },
  {
    name: 'Laos',
    code: 'LA',
    dialCode: '+856',
  },
  {
    name: 'Lebanon',
    code: 'LB',
    dialCode: '+961',
  },
  {
    name: 'Latvia',
    code: 'LV',
    dialCode: '+371',
  },
  {
    name: 'Liberia',
    code: 'LR',
    dialCode: '+231',
  },
  {
    name: 'Luxembourg',
    code: 'LU',
    dialCode: '+352',
  },
  {
    name: 'Madagascar',
    code: 'MG',
    dialCode: '+261',
  },
  {
    name: 'Malawi',
    code: 'MW',
    dialCode: '+265',
  },
  {
    name: 'Malaysia',
    code: 'MY',
    dialCode: '+60',
  },
  {
    name: 'Bahrain',
    code: 'BH',
    dialCode: '+973',
  },
  {
    name: 'Mauritania',
    code: 'MR',
    dialCode: '+222',
  },
  {
    name: 'Mauritius',
    code: 'MU',
    dialCode: '+230',
  },
  {
    name: 'Monaco',
    code: 'MC',
    dialCode: '+377',
  },
  {
    name: 'Mongolia',
    code: 'MN',
    dialCode: '+976',
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    dialCode: '+880',
  },
  {
    name: 'Montserrat',
    code: 'MS',
    dialCode: '+1664',
  },
  {
    name: 'Sudan',
    code: 'SD',
    dialCode: '+249',
  },
  {
    name: 'Armenia',
    code: 'AM',
    dialCode: '+374',
  },
  {
    name: 'Mozambique',
    code: 'MZ',
    dialCode: '+258',
  },
  {
    name: 'Oman',
    code: 'OM',
    dialCode: '+968',
  },
  {
    name: 'Barbados',
    code: 'BB',
    dialCode: '+1246',
  },
  {
    name: 'Nauru',
    code: 'NR',
    dialCode: '+674',
  },
  {
    name: 'Aruba',
    code: 'AW',
    dialCode: '+297',
  },
  {
    name: 'Netherlands',
    code: 'NL',
    dialCode: '+31',
  },
  {
    name: 'Curaçao',
    code: 'CW',
    dialCode: '+5999',
  },
  {
    name: 'New Caledonia',
    code: 'NC',
    dialCode: '+687',
  },
  {
    name: 'Nigeria',
    code: 'NG',
    dialCode: '+234',
  },
  {
    name: 'Philippines',
    code: 'PH',
    dialCode: '+63',
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    dialCode: '+64',
  },
  {
    name: 'Vanuatu',
    code: 'VU',
    dialCode: '+678',
  },
  {
    name: 'Tokelau',
    code: 'TK',
    dialCode: '+690',
  },
  {
    name: 'Cook Islands',
    code: 'CK',
    dialCode: '+682',
  },
  {
    name: 'Niger',
    code: 'NE',
    dialCode: '+227',
  },
  {
    name: 'Suriname',
    code: 'SR',
    dialCode: '+597',
  },
  {
    name: 'Norfolk Island',
    code: 'NF',
    dialCode: '+6723',
  },
  {
    name: 'Palau',
    code: 'PW',
    dialCode: '+680',
  },
  {
    name: 'Pakistan',
    code: 'PK',
    dialCode: '+92',
  },
  {
    name: 'Panama',
    code: 'PA',
    dialCode: '+507',
  },
  {
    name: 'Bermuda',
    code: 'BM',
    dialCode: '+1441',
  },
  {
    name: 'Papua New Guinea',
    code: 'PG',
    dialCode: '+675',
  },
  {
    name: 'Paraguay',
    code: 'PY',
    dialCode: '+595',
  },
  {
    name: 'Peru',
    code: 'PE',
    dialCode: '+51',
  },
  {
    name: 'Puerto Rico',
    code: 'PR',
    dialCode: '+1787',
  },
  {
    name: 'Bhutan',
    code: 'BT',
    dialCode: '+975',
  },
  {
    name: 'Romania',
    code: 'RO',
    dialCode: '+40',
  },
  {
    name: 'Russian Federation',
    code: 'RU',
    dialCode: '+7',
  },
  {
    name: 'Saint Barthélemy',
    code: 'BL',
    dialCode: '+590',
  },
  {
    name: 'Bolivia (Plurinational State of)',
    code: 'BO',
    dialCode: '+591',
  },
  {
    name: 'Sao Tome and Principe',
    code: 'ST',
    dialCode: '+239',
  },
  {
    name: 'Serbia',
    code: 'RS',
    dialCode: '+381',
  },
  {
    name: 'Seychelles',
    code: 'SC',
    dialCode: '+248',
  },
  {
    name: 'Sierra Leone',
    code: 'SL',
    dialCode: '+232',
  },
  {
    name: 'Slovakia',
    code: 'SK',
    dialCode: '+421',
  },
  {
    name: 'Slovenia',
    code: 'SI',
    dialCode: '+386',
  },
  {
    name: 'Somalia',
    code: 'SO',
    dialCode: '+252',
  },
  {
    name: 'Botswana',
    code: 'BW',
    dialCode: '+267',
  },
  {
    name: 'Spain',
    code: 'ES',
    dialCode: '+34',
  },
  {
    name: 'Svalbard Jan Mayen',
    code: 'SJ',
    dialCode: '+4779',
  },
  {
    name: 'Eswatini',
    code: 'SZ',
    dialCode: '+268',
  },
  {
    name: 'Switzerland',
    code: 'CH',
    dialCode: '+41',
  },
  {
    name: 'Liechtenstein',
    code: 'LI',
    dialCode: '+423',
  },
  {
    name: 'Sweden',
    code: 'SE',
    dialCode: '+46',
  },
  {
    name: 'Syria',
    code: 'SY',
    dialCode: '+963',
  },
  {
    name: 'Thailand',
    code: 'TH',
    dialCode: '+66',
  },
  {
    name: 'Tonga',
    code: 'TO',
    dialCode: '+676',
  },
  {
    name: 'Trinidad and Tobago',
    code: 'TT',
    dialCode: '+1868',
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    dialCode: '+971',
  },
  {
    name: 'Tunisia',
    code: 'TN',
    dialCode: '+216',
  },
  {
    name: 'Uganda',
    code: 'UG',
    dialCode: '+256',
  },
  {
    name: 'North Macedonia',
    code: 'MK',
    dialCode: '+389',
  },
  {
    name: 'Egypt',
    code: 'EG',
    dialCode: '+20',
  },
  {
    name: 'United Kingdom of Great Britain and Northern Ireland',
    code: 'GB',
    dialCode: '+44',
  },
  {
    name: 'Tanzania, the United Republic of',
    code: 'TZ',
    dialCode: '+255',
  },
  {
    name: 'Belize',
    code: 'BZ',
    dialCode: '+501',
  },
  {
    name: 'United States of America',
    code: 'US',
    dialCode: '+1',
  },
  {
    name: 'Virgin Islands (British)',
    code: 'VG',
    dialCode: '+1284',
  },
  {
    name: 'Virgin Islands (U.S.)',
    code: 'VI',
    dialCode: '+1340',
  },
  {
    name: 'Turks and Caicos Islands',
    code: 'TC',
    dialCode: '+1649',
  },
  {
    name: 'Northern Mariana Islands',
    code: 'MP',
    dialCode: '+1670',
  },
  {
    name: 'American Samoa',
    code: 'AS',
    dialCode: '+1684',
  },
  {
    name: 'Sint Maarten (Netherlands)',
    code: 'SX',
    dialCode: '+1721',
  },
  {
    name: 'Dominican Republic',
    code: 'DO',
    dialCode: '+1809',
  },
  {
    name: 'Guinea-Bissau',
    code: 'GW',
    dialCode: '+245',
  },
  {
    name: 'British Indian Ocean Territory',
    code: 'IO',
    dialCode: '+246',
  },
  {
    name: 'Norway',
    code: 'NO',
    dialCode: '+47',
  },
  {
    name: 'Guadeloupe',
    code: 'GP',
    dialCode: '+590',
  },
  {
    name: 'Timor-Leste',
    code: 'TL',
    dialCode: '+670',
  },
  {
    name: 'Micronesia (Federated States of)',
    code: 'FM',
    dialCode: '+691',
  },
  {
    name: 'Marshall Islands',
    code: 'MH',
    dialCode: '+692',
  },
  {
    name: 'Uruguay',
    code: 'UY',
    dialCode: '+598',
  },
  {
    name: 'Uzbekistan',
    code: 'UZ',
    dialCode: '+998',
  },
  {
    name: 'Samoa',
    code: 'WS',
    dialCode: '+685',
  },
  {
    name: 'Yemen',
    code: 'YE',
    dialCode: '+967',
  },
  {
    name: 'Zambia',
    code: 'ZM',
    dialCode: '+260',
  },
  {
    name: 'Solomon Islands',
    code: 'SB',
    dialCode: '+677',
  },
  {
    name: 'Taiwan',
    code: 'TW',
    dialCode: '+886',
  },
  {
    name: 'Martinique',
    code: 'MQ',
    dialCode: '+596',
  },
  {
    name: 'San Marino',
    code: 'SM',
    dialCode: '+378',
  },
  {
    name: 'Turkmenistan',
    code: 'TM',
    dialCode: '+993',
  },
  {
    name: 'Germany',
    code: 'DE',
    dialCode: '+49',
  },
  {
    name: 'Venezuela (Bolivarian Republic of)',
    code: 'VE',
    dialCode: '+58',
  },
  {
    name: 'South Sudan',
    code: 'SS',
    dialCode: '+211',
  },
  {
    name: 'Senegal',
    code: 'SN',
    dialCode: '+221',
  },
  {
    name: 'Morocco',
    code: 'MA',
    dialCode: '+212',
  },
  {
    name: 'Azerbaijan',
    code: 'AZ',
    dialCode: '+994',
  },
  {
    name: 'Réunion',
    code: 'RE',
    dialCode: '+262',
  },
  {
    name: 'Turkey',
    code: 'TR',
    dialCode: '+90',
  },
  {
    name: 'Chad',
    code: 'TD',
    dialCode: '+235',
  },
  {
    name: 'Central African Republic',
    code: 'CF',
    dialCode: '+236',
  },
  {
    name: 'Cameroon',
    code: 'CM',
    dialCode: '+237',
  },
  {
    name: 'Congo',
    code: 'CG',
    dialCode: '+242',
  },
  {
    name: 'Djibouti',
    code: 'DJ',
    dialCode: '+253',
  },
  {
    name: 'El Salvador',
    code: 'SV',
    dialCode: '+503',
  },
  {
    name: 'Anguilla',
    code: 'AI',
    dialCode: '+1264',
  },
  {
    name: 'Antigua and Barbuda',
    code: 'AG',
    dialCode: '+1268',
  },
  {
    name: 'Saint Kitts and Nevis',
    code: 'KN',
    dialCode: '+1869',
  },
  {
    name: 'Saint Helena Ascension Island Tristan da Cunha',
    code: 'SH',
    dialCode: '+290',
  },
  {
    name: 'Greenland',
    code: 'GL',
    dialCode: '+299',
  },
  {
    name: 'Montenegro',
    code: 'ME',
    dialCode: '+382',
  },
  {
    name: 'Denmark',
    code: 'DK',
    dialCode: '+45',
  },
  {
    name: 'Saint Pierre and Miquelon',
    code: 'PM',
    dialCode: '+508',
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
    dialCode: '+226',
  },
  {
    name: 'Togo',
    code: 'TG',
    dialCode: '+228',
  },
  {
    name: 'Portugal',
    code: 'PT',
    dialCode: '+351',
  },
  {
    name: 'Italy',
    code: 'IT',
    dialCode: '+39',
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
    dialCode: '+420',
  },
  {
    name: 'Nicaragua',
    code: 'NI',
    dialCode: '+505',
  },
  {
    name: 'Maldives',
    code: 'MV',
    dialCode: '+960',
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    dialCode: '+966',
  },
  {
    name: 'French Guiana',
    code: 'GF',
    dialCode: '+594',
  },
  {
    name: 'Bonaire Sint Eustatius Saba',
    code: 'BQ',
    dialCode: '+5997',
  },
  {
    name: 'Wallis and Futuna',
    code: 'WF',
    dialCode: '+681',
  },
  {
    name: 'Brunei Darussalam',
    code: 'BN',
    dialCode: '+673',
  },
  {
    name: 'Western Sahara',
    code: 'EH',
    dialCode: '+212',
  },
  {
    name: 'Macao',
    code: 'MO',
    dialCode: '+853',
  },
  {
    name: 'Afghanistan',
    code: 'AF',
    dialCode: '+93',
  },
  {
    name: 'Tajikistan',
    code: 'TJ',
    dialCode: '+992',
  },
  {
    name: 'Angola',
    code: 'AO',
    dialCode: '+244',
  },
  {
    name: 'Belarus',
    code: 'BY',
    dialCode: '+375',
  },
  {
    name: 'Bulgaria',
    code: 'BG',
    dialCode: '+359',
  },
  {
    name: 'Congo (the Democratic Republic of the)',
    code: 'CD',
    dialCode: '+243',
  },
  {
    name: 'Bosnia and Herzegovina',
    code: 'BA',
    dialCode: '+387',
  },
  {
    name: 'Grenada',
    code: 'GD',
    dialCode: '+1473',
  },
  {
    name: 'Saint Lucia',
    code: 'LC',
    dialCode: '+1758',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'VC',
    dialCode: '+1784',
  },
  {
    name: 'Libya',
    code: 'LY',
    dialCode: '+218',
  },
  {
    name: 'Mali',
    code: 'ML',
    dialCode: '+223',
  },
  {
    name: 'Rwanda',
    code: 'RW',
    dialCode: '+250',
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    dialCode: '+25524',
  },
  {
    name: 'Mayotte',
    code: 'YT',
    dialCode: '+262',
  },
  {
    name: 'Lesotho',
    code: 'LS',
    dialCode: '+266',
  },
  {
    name: 'Eritrea',
    code: 'ER',
    dialCode: '+291',
  },
  {
    name: 'Belgium',
    code: 'BE',
    dialCode: '+32',
  },
  {
    name: 'France',
    code: 'FR',
    dialCode: '+33',
  },
  {
    name: 'Malta',
    code: 'MT',
    dialCode: '+356',
  },
  {
    name: 'Finland',
    code: 'FI',
    dialCode: '+358',
  },
  {
    name: 'Åland Islands',
    code: 'AX',
    dialCode: '+35818',
  },
  {
    name: 'Lithuania',
    code: 'LT',
    dialCode: '+370',
  },
  {
    name: 'Moldova (the Republic of)',
    code: 'MD',
    dialCode: '+373',
  },
  {
    name: 'Andorra',
    code: 'AD',
    dialCode: '+376',
  },
  {
    name: 'Austria',
    code: 'AT',
    dialCode: '+43',
  },
  {
    name: 'Poland',
    code: 'PL',
    dialCode: '+48',
  },
  {
    name: 'Mexico',
    code: 'MX',
    dialCode: '+52',
  },
  {
    name: 'Cuba',
    code: 'CU',
    dialCode: '+53',
  },
  {
    name: 'Saint Martin (France)',
    code: 'MF',
    dialCode: '+590',
  },
  {
    name: 'Singapore',
    code: 'SG',
    dialCode: '+65',
  },
  {
    name: 'Fiji',
    code: 'FJ',
    dialCode: '+679',
  },
  {
    name: 'Kiribati',
    code: 'KI',
    dialCode: '+686',
  },
  {
    name: 'Viet Nam',
    code: 'VN',
    dialCode: '+84',
  },
  {
    name: 'Iraq',
    code: 'IQ',
    dialCode: '+964',
  },
  {
    name: 'Palestine, State of',
    code: 'PS',
    dialCode: '+970',
  },
  {
    name: 'Israel',
    code: 'IL',
    dialCode: '+972',
  },
  {
    name: 'Qatar',
    code: 'QA',
    dialCode: '+974',
  },
  {
    name: 'Nepal',
    code: 'NP',
    dialCode: '+977',
  },
  {
    name: 'Ukraine',
    code: 'UA',
    dialCode: '+380',
  },
  {
    name: 'Gabon',
    code: 'GA',
    dialCode: '+241',
  },
  {
    name: 'Pitcairn Islands',
    code: 'PN',
    dialCode: '+64',
  },
  {
    name: 'Brazil',
    code: 'BR',
    dialCode: '+55',
  },
  {
    name: 'South Africa',
    code: 'ZA',
    dialCode: '+27',
  },
  {
    name: 'Jersey',
    code: 'JE',
    dialCode: '+441534',
  },
  {
    name: 'Guernsey',
    code: 'GG',
    dialCode: '+447',
  },
  {
    name: 'Isle of Man',
    code: 'IM',
    dialCode: '+447',
  },
  {
    name: 'Tuvalu',
    code: 'TV',
    dialCode: '+688',
  },
];

export const MONTHS = [
  {
    month: 'January',
    value: 1,
  },
  {
    month: 'February',
    value: 2,
  },
  {
    month: 'March',
    value: 3,
  },
  {
    month: 'April',
    value: 4,
  },
  {
    month: 'May',
    value: 5,
  },
  {
    month: 'June',
    value: 6,
  },
  {
    month: 'July',
    value: 7,
  },
  {
    month: 'August',
    value: 8,
  },
  {
    month: 'September',
    value: 9,
  },
  {
    month: 'October',
    value: 10,
  },
  {
    month: 'November',
    value: 11,
  },
  {
    month: 'December',
    value: 12,
  },
];

export const DEFAULT_COUNTRY: Country = {
  name: 'United Arab Emirates',
  code: 'AE',
};
