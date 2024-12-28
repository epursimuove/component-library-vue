import type {
  AutomaticPropertyType,
  PropertyType,
  PropertyValue,
  RowItem,
} from "@/types/type.ts";
import { createRandomId } from "@/utils/util.ts";

export const capitalize = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

export const decapitalize = (str: string) =>
  str.slice(0, 1).toLowerCase() + str.slice(1);

export const prettifyPropertyName = (propertyName: string): string => {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
  const parts = propertyName.split(/([A-Z])/);

  const prettified: string = parts.reduce(
    (
      accumulator: string,
      currentValue: string,
      currentIndex: number,
    ): string => {
      if (currentIndex === 0) {
        return `${accumulator}${capitalize(currentValue)}`;
      }

      if (currentIndex % 2 === 1) {
        return `${accumulator} ${decapitalize(currentValue)}`;
      }

      return `${accumulator}${currentValue}`;
    },
    "",
  );

  // return prettified;
  return prettified.replace("Number of", "#");
};

const localDateRegExp: RegExp = new RegExp(/^\d\d\d\d-\d\d-\d\d$/);

const countryCodeRegExp: RegExp = new RegExp(/^[A-Z]{2}$/);

export const getPropertyType = (
  propertyValue: PropertyValue,
  propertyName?: string,
): PropertyType => {
  if (propertyValue === undefined || propertyValue === null) {
    return "text";
  }

  const automaticPropertyType: AutomaticPropertyType = typeof propertyValue;

  switch (automaticPropertyType) {
    case "boolean":
      return "boolean";

    case "string":
      if (localDateRegExp.test(propertyValue as string)) {
        return "localDate";
      }
      if (
        propertyName === "countryCode" &&
        countryCodeRegExp.test(propertyValue as string)
      ) {
        return "countryCode";
      }
      return "text";

    case "number":
      if (Number.isInteger(propertyValue)) {
        return "integer";
      }
      return "decimalNumber";

    default:
      return "text";
  }
};

export const getPropertyTypesForObject = (
  object: Record<string, PropertyValue>,
): Record<string, PropertyType> => {
  const propertyTypes: Record<string, PropertyType> = {};

  Object.entries(object).forEach(([propertyName, propertyValue]) => {
    const propertyType: PropertyType = getPropertyType(
      propertyValue,
      propertyName,
    );

    propertyTypes[propertyName] = propertyType;

    // TODO JUST FOR TESTING!!! OR?!? PERHAPS REMOVE WHEN NOT NEEDED ANYMORE!!
    if (propertyName === "salary") {
      propertyTypes[propertyName] = "decimalNumber";
    } else if (propertyName === "numberOfChildren") {
      propertyTypes[propertyName] = "positiveInteger";
      // } else if (propertyName === "countryCode") {
      //   propertyTypes[propertyName] = "countryCode";
    } else if (propertyName === "percentage") {
      propertyTypes[propertyName] = "percentage";
    } else if (propertyName === "promille") {
      propertyTypes[propertyName] = "promille";
    }

    //console.log("entry", [propertyName, propertyValue], propertyType);
  });

  return propertyTypes;
};

type DummyUser = {
  firstName: string;
  lastName: string;
  fullName?: string;
  age: number;
  married: boolean;
  salary: number;
  numberOfChildren: number;
  registeredLocalDate: string;
  countryCode?: "SE" | "DK" | "FI" | "NO" | "IS";
};

export const dummyTabularData: DummyUser[] = [
  {
    firstName: "John",
    lastName: "Doe",
    age: 34,
    married: true,
    salary: 12345,
    numberOfChildren: 3,
    registeredLocalDate: "2024-01-05",
  },
  {
    firstName: "Jennifer",
    lastName: "Johnson",
    age: 67,
    married: false,
    salary: 7654,
    numberOfChildren: 4,
    registeredLocalDate: "2019-10-29",
  },
  {
    firstName: "Caroline",
    lastName: "Svensson",
    age: 27,
    married: true,
    salary: 334455,
    numberOfChildren: 0,
    registeredLocalDate: "1993-06-09",
  },
  {
    firstName: "Mark",
    lastName: "Baptiste",
    age: 93,
    married: true,
    salary: 6677,
    numberOfChildren: 2,
    registeredLocalDate: "1998-11-24",
  },
  {
    firstName: "Lisa",
    lastName: "Baptiste",
    age: 8,
    married: false,
    salary: 0,
    numberOfChildren: 0,
    registeredLocalDate: "2005-03-01",
  },
  {
    firstName: "Johannes-Christian",
    lastName: "von Wachtmeister",
    age: 40,
    married: false,
    salary: 50505,
    numberOfChildren: 3,
    registeredLocalDate: "2015-04-09",
  },
  {
    firstName: "Michael",
    lastName: "Scott",
    age: 102,
    married: false,
    salary: 765,
    numberOfChildren: 0,
    registeredLocalDate: "2022-10-25",
  },
  {
    firstName: "Sara",
    lastName: "Schumacher",
    age: 54,
    married: true,
    salary: 991199,
    numberOfChildren: 2,
    registeredLocalDate: "2014-02-21",
  },
  {
    firstName: "Äspen",
    lastName: "Ärlandsson",
    age: 29,
    married: false,
    salary: 42323,
    numberOfChildren: 1,
    registeredLocalDate: "2007-11-30",
  },
  {
    firstName: "Ürsula",
    lastName: "Jonesberger",
    age: 85,
    married: true,
    salary: 987,
    numberOfChildren: 0,
    registeredLocalDate: "1992-04-21",
  },
  {
    firstName: "Caroline",
    lastName: "Scott",
    age: 16,
    married: false,
    salary: 4321,
    numberOfChildren: 0,
    registeredLocalDate: "2024-12-03",
  },
  {
    firstName: "Carl-Magnus",
    lastName: "Christiansen",
    age: 29,
    married: false,
    salary: 1122,
    numberOfChildren: 1,
    registeredLocalDate: "2023-07-12",
  },
  {
    firstName: "Christine",
    lastName: "Smith-Wesson",
    age: 88,
    married: false,
    salary: 987321,
    numberOfChildren: 0,
    registeredLocalDate: "2023-09-22",
  },
  {
    firstName: "Åsa",
    lastName: "Öberg",
    age: 41,
    married: true,
    salary: 79292,
    numberOfChildren: 0,
    registeredLocalDate: "2007-04-06",
  },
  {
    firstName: "H.C.",
    lastName: "Andersen",
    age: 73,
    married: false,
    salary: 554433,
    numberOfChildren: 3,
    registeredLocalDate: "1984-01-19",
  },
  {
    firstName: "John",
    lastName: "Bauer",
    age: 59,
    married: true,
    salary: 552241,
    numberOfChildren: 1,
    registeredLocalDate: "1999-12-31",
  },
  {
    firstName: "John",
    lastName: "Wayne",
    age: 7,
    married: false,
    salary: 0,
    numberOfChildren: 0,
    registeredLocalDate: "2024-11-01",
  },
  {
    firstName: "Sarah",
    lastName: "Jönsson",
    age: 25,
    married: false,
    salary: 887766,
    numberOfChildren: 1,
    registeredLocalDate: "2021-05-28",
  },
  {
    firstName: "Klas-Jürgen",
    lastName: "Doppler",
    age: 33,
    married: false,
    salary: 876543,
    numberOfChildren: 2,
    registeredLocalDate: "2005-09-19",
  },
  {
    firstName: "Östen",
    lastName: "Åkerblad",
    age: 62,
    married: false,
    salary: 74372,
    numberOfChildren: 4,
    registeredLocalDate: "2007-11-22",
  },
  {
    firstName: "Dwight",
    lastName: "Schrute",
    age: 103,
    married: true,
    salary: 3453,
    numberOfChildren: 0,
    registeredLocalDate: "2017-10-12",
  },
];

export const dummyConfigurationList: RowItem[] = [
  {
    propertyName: "firstName",
    propertyType: "text",
    automaticPropertyType: "string",
    label: "First name",
    sticky: true, // TODO Perhaps better with "LEFT" | "RIGHT"?!?
    enabled: true,
    numberOfDistinctValues: 12,
  },
  {
    propertyName: "lastName",
    propertyType: "text",
    automaticPropertyType: "string",
    label: "Last name",
    sticky: false,
    enabled: true,
    numberOfDistinctValues: 9,
  },
  {
    propertyName: "age",
    propertyType: "integer",
    automaticPropertyType: "number",
    label: "Age",
    sticky: false,
    enabled: true,
    numberOfDistinctValues: 11,
  },
  {
    propertyName: "married",
    propertyType: "boolean",
    automaticPropertyType: "boolean",
    label: "Married",
    sticky: false,
    enabled: true,
    numberOfDistinctValues: 2,
  },
  {
    propertyName: "salary",
    propertyType: "decimalNumber",
    automaticPropertyType: "number",
    label: "Salary",
    sticky: false,
    enabled: true,
    numberOfDistinctValues: 9,
  },
  {
    propertyName: "numberOfChildren",
    propertyType: "positiveInteger",
    automaticPropertyType: "number",
    label: "# children",
    sticky: false,
    enabled: true,
    numberOfDistinctValues: 4,
  },
  {
    propertyName: "registeredLocalDate",
    propertyType: "localDate",
    automaticPropertyType: "string",
    label: "Registered local date",
    sticky: false,
    enabled: true,
    numberOfDistinctValues: 4,
  },
];

export const createDummyNumberList = (numberOfItems?: number): RowItem[] => {
  const randomNumberOfItems: number = numberOfItems ?? createRandomId(100);

  const dummyList: RowItem[] = [];
  for (let n: number = 1; n <= randomNumberOfItems; n++) {
    dummyList.push({
      n,
      double: 2 * n,
      triple: 3 * n,
      square: n * n,
      firstRandom: createRandomId(100),
      secondRandom: createRandomId(1000),
      percentage: createRandomId(100) > 50 ? 1 / createRandomId(1000) : 0,
      promille: createRandomId(100) > 50 ? 1 / createRandomId(10000) : 0,
    });
  }

  return dummyList;
};

export const createDummyUserList = (): DummyUser[] => {
  const firstNames: string[] = dummyTabularData.map(
    (user: DummyUser) => user.firstName,
  );
  const lastNames: string[] = dummyTabularData.map(
    (user: DummyUser) => user.lastName,
  );

  const countryCodes: ("SE" | "DK" | "FI" | "NO" | "IS")[] = [
    "SE",
    "DK",
    "FI",
    "NO",
    "IS",
  ];

  // const randomNumberOfItems: number = createRandomId(2000) + 100;
  const randomNumberOfItems: number = createRandomId(50) + 100;

  const dummyList: DummyUser[] = [];
  for (let n: number = 1; n <= randomNumberOfItems; n++) {
    const user: DummyUser = {
      firstName: firstNames[createRandomId(firstNames.length - 1)],
      lastName: lastNames[createRandomId(lastNames.length - 1)],
      age: createRandomId(105),
      married: createRandomId(3) > 2,
      salary: createRandomId(100000),
      numberOfChildren: createRandomId(6) - 1,
      registeredLocalDate: `${createRandomId(45) + 1980}-0${createRandomId(9)}-${createRandomId(18) + 10}`, // TODO Better dates :)
    };
    user.fullName = `${user.firstName} ${user.lastName}`;
    user.countryCode = countryCodes[createRandomId(countryCodes.length) - 1];
    dummyList.push(user);
  }

  return dummyList;
};

function createDummyListOfCountries(): Record<string, PropertyValue>[] {
  const countries = [
    { countryName: "Sweden", countryCode: "SE", languageCode: "sv" },
    { countryName: "Finland", countryCode: "FI", languageCode: "fi" },
    { countryName: "Norway", countryCode: "NO", languageCode: "no" },
    { countryName: "Denmark", countryCode: "DK", languageCode: "da" },
    { countryName: "Iceland", countryCode: "IS", languageCode: "is" },
    { countryName: "France", countryCode: "FR", languageCode: "fr" },
    { countryName: "Germany", countryCode: "DE", languageCode: "de" },
    { countryName: "Poland", countryCode: "PL", languageCode: "pl" },
    { countryName: "Great Britain", countryCode: "GB", languageCode: "en" },
    { countryName: "Ireland", countryCode: "IE", languageCode: "en" },
    { countryName: "Italy", countryCode: "IT", languageCode: "it" },
    { countryName: "Spain", countryCode: "ES", languageCode: "es" },
    { countryName: "Portugal", countryCode: "PT", languageCode: "pt" },
    { countryName: "Greece", countryCode: "GR", languageCode: "el" },
    { countryName: "Canada", countryCode: "CA", languageCode: "en" },
    { countryName: "United States", countryCode: "US", languageCode: "en" },
    { countryName: "India", countryCode: "IN", languageCode: "en" },
    { countryName: "Australia", countryCode: "AU", languageCode: "en" },
    { countryName: "Japan", countryCode: "JP", languageCode: "ja" },
  ];

  const now: Date = new Date();

  countries.forEach(
    (country: {
      countryName: string;
      countryCode: string;
      languageCode: string;
      name?: string;
      language?: string;
      name2?: string;
      language2?: string;
      dateFormat?: string;
    }): void => {
      country.name = new Intl.DisplayNames([country.languageCode], {
        type: "region",
      }).of(country.countryCode);

      country.language = new Intl.DisplayNames([country.languageCode], {
        type: "language",
      }).of(country.languageCode);

      country.name2 = new Intl.DisplayNames(["en"], {
        type: "region",
      }).of(country.countryCode);

      country.language2 = new Intl.DisplayNames(["en"], {
        type: "language",
      }).of(country.languageCode);

      country.dateFormat = new Intl.DateTimeFormat(
        `${country.languageCode}-${country.countryCode}`,
      ).format(now);
    },
  );

  return countries;
}

export const dummyListOfCountries: Record<string, PropertyValue>[] =
  createDummyListOfCountries();
