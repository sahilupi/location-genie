import { Rule } from '../models/step-three.model';

export class StepThreeData {
  public static rules: Rule[] = [
    {
      id: 'rule-1',
      name: 'Adult filming allowed',
      checked: null,
    },
    {
      id: 'rule-2',
      name: 'Electricity usage allowed',
      checked: null,
    },
    {
      id: 'rule-3',
      name: 'Smoking allowed',
      checked: null,
    },
    {
      id: 'rule-4',
      name: 'Pets allowed',
      checked: null,
    },
    {
      id: 'rule-5',
      name: 'Outside catering/food allowed',
      checked: null,
    },
    {
      id: 'rule-6',
      name: 'Cooking allowed',
      checked: null,
    },
    {
      id: 'rule-7',
      name: 'Alcohol allowed',
      checked: null,
    },
    {
      id: 'rule-8',
      name: 'Loud noises allowed',
      checked: null,
    },
  ];

  public static initialEvent = 'EventInitialPrice';
  public static initialMeeting = 'MeetingInitialPrice';
  public static initialProduction = 'ProductionInitialPrice';
  public static serviceFee = 'ServiceFee';
  public static defaultPercentage = {
    forFourtySixtoSixty: 'ChargeForFourtySixtoSixtyPeople',
    forSixteentoThirty: 'ChargeForSixteentoThirtyPeople',
    forSixtoFifteen: 'ChargeForSixToFifteenPeople',
    forSixtyPlus: 'ChargeForSixtyPlusPeople',
    forThirtyOnetoFourtyFive: 'ChargeForThirtyOnetoFourtyFivePeople',
  };
}
