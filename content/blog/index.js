import { article as kakVybratKolenchatyjPodemnikArticle } from "./kak-vybrat-kolenchatyj-podemnik";
import { article as kakVybratTeleskopicheskijPogruzchikArticle } from "./kak-vybrat-teleskopicheskij-pogruzchik";
import { article as forkliftArticle } from "./kak-vybrat-vilochnyj-pogruzchik";
import { article as dieselArticle } from "./dizelnyj-ili-elektricheskij-pogruzchik";
import { article as scissorLiftArticle } from "./kak-vybrat-nozhnichnyj-podemnik";

export const articles = {
  [kakVybratKolenchatyjPodemnikArticle.slug]: kakVybratKolenchatyjPodemnikArticle,
  [kakVybratTeleskopicheskijPogruzchikArticle.slug]: kakVybratTeleskopicheskijPogruzchikArticle,
  [forkliftArticle.slug]: forkliftArticle,
  [dieselArticle.slug]: dieselArticle,
  [scissorLiftArticle.slug]: scissorLiftArticle,
};