import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { ContinentBar } from "../../components/continent-bar/continent-bar";
import { CountryCard } from "../../components/country-card/country-card";
import { CountryList } from "../country-list/country-list";

@Component({
  selector: 'app-home',
  imports: [Navbar, ContinentBar, CountryCard, CountryList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
countries = [];
  
}
