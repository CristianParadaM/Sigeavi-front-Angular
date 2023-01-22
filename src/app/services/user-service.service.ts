import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Farm } from '../farm.model';
import { Food } from '../food.model';
import { Lot } from '../lot.model';
import { Sheed } from '../sheed.model';
import { HttpClient } from "@angular/common/http";
import Swal from "sweetalert2";
import { FoodHistory } from '../foodhistory.model';

@Injectable({
  providedIn: 'root'
})

export class UserServiceService {

  private infoUser: object[];
  private permissions: object[];
  public farms: Farm[];
  private users: string[];
  private lots: Lot[];
  private sheeds: Sheed[];
  private allpermises = [-1, 0, 0.1, 1, 1.1, 1.2, 1.3, 1.4, 2, 2.1, 2.2, 2.3, 2.4, 3, 3.1, 3.2, 3.3, 4, 4.1, 4.2, 4.3, 4.4, 5, 5.1];
  private foodInventory: Food[];
  private foodHistory: FoodHistory[];
  protected userActive: string;
  protected idUserActive: number;
  protected url = 'https://sigeavi-be.onrender.com';
  protected idSelected;

  constructor(private auth: Auth, private activatedRoute: ActivatedRoute, private http: HttpClient, private route: Router) {
    this.lots = [];
    this.sheeds = [];
    this.foodHistory = [];
    this.foodInventory = [];
    this.farms = [];
    this.permissions = [];
    if (this.auth.currentUser != null) {
      this.updateSession(this.auth.currentUser.email);
      this.updateProfile(this.auth.currentUser.email);
    }
  }

  updateMortality(selectedLot: number, killsNumber: number) {
    return this.http.post<boolean>(this.url + '/farm/' + this.idSelected + '/' + selectedLot + '/daily_report/add', { consumption: 0, deaths: killsNumber });
  }

  updateWater(selectedLot: number, litersNumber: number) {
    return this.http.post(this.url + '/farm/' + this.idSelected + '/' + selectedLot + '/daily_report/add', { consumption: litersNumber, deaths: 0 });
  }

  getMortalityWater(selectedLot: any) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/' + selectedLot + '/daily_report');
  }

  getWeightHistory(selectedLot: any) {
    return this.http.get(this.url + '/farm/' + selectedLot + '/weight');
  }

  getUserActive() {
    return this.userActive;
  }

  getInventory() {
    return this.foodInventory;
  }

  async updateFarms() {
    await this.updateSession(this.auth.currentUser.email);
  }

  isRepeated(farm: Farm, farms: Farm[]): boolean {
    let aux: boolean;
    for (let i = 0; i < farms.length; i++) {
      if (farms[i] != farm) {
        if (farms[i].name == farm.name) {
          aux = true;
          break;
        }
      }
    }
    return aux;
  }

  update(lot: any, date: any, sheed: any, quanty: any, race: any) {
    let index = this.lots.findIndex(element => element.lot == lot);
    this.lots[index].date = date;
    this.lots[index].sheed = sheed;
    this.lots[index].quanty = quanty;
    this.lots[index].race = race;
  }

  registerUser(isSocialNetwork: boolean, names: string, lastnames: string, email: string, phone: number, id: number, pass: string) {
    if (!isSocialNetwork) {
      this.createUserNoSocialNetwork(names, lastnames, email, phone, id, pass);
    } else {
      this.createUserSocialNetwork(names, lastnames, email, phone, id, pass);
    }
  }
  
  private createUserSocialNetwork(names: string, lastnames: string, email: string, phone: number, id: number, pass: string) {
    let username = email;
    let user = { id, names, lastnames, email, phone, username, pass };
    this.http.post(this.url + '/signup', user).subscribe({
      complete() {
        Swal.fire({
          icon: 'success',
          text: 'Usuario creado exitosamente',
          showConfirmButton: false,
          timer: 1500
        });
        this.route.navigate(["/home/login"]);
      }, error() {
        Swal.fire({
          icon: 'error',
          text: 'Usuario con esas credenciales ya existe',
        });
      },
    });
  }

  private createUserNoSocialNetwork(names: string, lastnames: string, email: string, phone: number, id: number, pass: string) {
    createUserWithEmailAndPassword(this.auth, email, pass).then(res => {
      let user = { id, names, lastnames, email, phone, username: email, pass };
      this.http.post<boolean>(this.url + '/signup', user).subscribe({
        complete() {
          Swal.fire({
            icon: 'success',
            text: 'Usuario creado exitosamente',
          });
          this.route.navigate(["/home/login"]);
        },
        error() {
          Swal.fire({
            icon: 'error',
            text: 'Usuario con esas credenciales ya existe',
          });
        },
      });
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        text: 'Usuario con esas credenciales ya existe',
      });
    });
  }

  loginWithEmailAndPassword(email, password) {
    this.http.post(this.url + '/login', { user: email, password: password }).subscribe(
      async res => {
        signInWithEmailAndPassword(this.auth, email, password);
        this.updateSession(email);
        this.updateProfile(email);
      },
      err => {
        Swal.fire({
          icon: 'error',
          text: 'Usuario o contraseña incorrectos',
        });
      }
    );
  }

  /**
   * Metodo para actualizar la informacion de la sesión
   * @param email Usuario activo
   */
  private updateSession(email) {
    this.http.get<Farm[]>(this.url + '/' + email + '/farms').subscribe(farms => {
      this.farms = farms
      this.farms.forEach(farm => this.permissions.push({ farm: farm.name, permises: this.allpermises }));
    });
  }

  getInfoUser() {
    return this.infoUser;
  }

  private updateProfile(email) {
    this.http.post(this.url + '/profile/', { email }).subscribe(
      res2 => {
        this.infoUser = [{
          id: res2[0]['id'],
          names: res2[0]['name'],
          lastnames: res2[0]['lastname'],
          email: res2[0]['email'],
          phone: res2[0]['phone'],
          userType: res2[0]['user_type'],
          idPerson: res2[0]['id_person'],
        }];
        this.userActive = res2[0]['name'] + ' ' + res2[0]['lastname'];
        this.idUserActive = res2[0]['id'];
        this.route.navigate(["/menu/news"]);
      }, err2 => {
        console.log(err2)
      }
    );
  }

  loginWithGoogle() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then(
      async res => {
        await this.loadUsers(res);
        this.updateSession(res.user.email);
        this.updateProfile(res.user.email);
      }
    ).catch(err => {
    });
  }

  async loadUsers(res) {
    await this.http.get(this.url + '/users').subscribe(
      (res2: string[]) => {
        let pass = false;
        for (let i = 0; i < res2['length']; i++) {
          if (res2[i]['username'] == res.user.email) {
            this.route.navigate(['/menu/news']);
            pass = true;
            break;
          }
        }
        if (!pass) {
          this.route.navigate(['/home/registerWithFacebook', res.user.email, res.user.displayName]);
        }
      },
      err => console.log(err)
    );
  }

  getLots() {
    return this.lots;
  }

  loginWithFacebook() {
    signInWithPopup(this.auth, new FacebookAuthProvider()).then(
      async res => {
        await this.loadUsers(res);
        this.updateSession(res.user.email);
        this.updateProfile(res.user.email);
      }
    ).catch(err => {
    });
  }

  logout() {
    return this.auth.signOut();
  }

  getUsersRegistered() {
    return this.users;
  }

  getFarms() {
    return this.farms;
  }

  getFoodHistory(): FoodHistory[] {
    return this.foodHistory;
  }

  getSheeds() {
    return this.sheeds
  }

  getPermissions(): object[] {
    return this.permissions;
  }

  verifyCode(email) {
    return this.http.get(this.url + '/login/recoveryCode/' + email);
  }

  addLot(dateOfBirth: any, lotNumber: any, sheed: any, amount_hens: any, race: any) {
    return this.http.post(this.url + '/farm/' + this.idSelected + '/' + sheed + '/lots/add', { race, amount_hens, lotNumber, dateOfBirth });
  }

  addShed(shedNumber: number, width: number, length: number) {
    return this.http.post(this.url + '/farm/' + this.idSelected + '/sheds/add', { shedNumber, width, length });
  }

  async selectFarm(id) {
    this.idSelected = id;
    this.updateSheds().subscribe(
      async res => {
        this.sheeds = [];
        for (let i = 0; i < res['length']; i++) {
          this.sheeds.push(new Sheed(res[i]['id'], 'G-' + res[i]['shedNumber'], res[i]['amount_hens'], res[i]['width'], res[i]['length']));
        }
      }
    );
    this.updateLots().subscribe(
      res => {
        this.lots = [];
        for (let i = 0; i < res['length']; i++) {
          let date = res[i].dateOfBirth.split('T')[0].split('-');
          this.lots.push(new Lot(res[i].id, 'L-' + res[i].lotNumber, date[2] + '/' + date[1] + '/' + date[0], 'G-' + res[i].shedNumber, res[i].amount_hens, res[i].race));
        }
      }
    );
    this.updateFoods().subscribe(
      res => {
        this.foodHistory = [];
        for (let i = 0; i < res['length']; i++) {
          this.foodHistory.push(new FoodHistory(res[i]['id_food'], res[i]['name'], res[i]['mark'], res[i]['weight'], res[i]['cantidad']));
        }
      }
    );
  }

  private codeInventory;

  setCodeInventory(code) {
    this.codeInventory = code;
  }

  setfoodHistory(foodHistory: any[]) {
    this.foodHistory = foodHistory
  }

  getFoodInventoryByCode() {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/food_inventory/' + this.codeInventory);
  }

  updateFoods() {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/food_inventory');
  }

  updateLots() {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/lots');
  }

  removeLot(id) {
    return this.http.delete(this.url + '/farm/' + this.idSelected + '/lots/delete', { "body": { id } });
  }

  removeShed(id) {
    return this.http.delete(this.url + '/farm/' + this.idSelected + '/sheds/delete', { "body": { id } });
  }

  removeFarm(idFarm: number) {
    return this.http.delete(this.url + '/delete', { "body": { idFarm } });
  }

  setLots(lots: Lot[]) {
    this.lots = lots;
  }

  setSheds(sheds: Sheed[]) {
    this.sheeds = sheds;
  }

  setFoodInventory(foodInventory: Food[]) {
    this.foodInventory = foodInventory;
  }

  putLots(id: any, lotNumber: any, dateOfBirth: any, sheed: any, amount_hens: any, race: any) {
    //sheed opcional
    return this.http.put(this.url + "/farm/" + this.idSelected + "/lots/update", { id, race, amount_hens, lotNumber, dateOfBirth });
  }

  putSheds(id: any, shedNumber: any, width: any, length: any) {
    return this.http.put(this.url + "/farm/" + this.idSelected + "/sheds/update", { id, shedNumber, width, length });
  }

  putFarm(farm: Object) {
    return this.http.put(this.url + '/update', { id: farm['id'], name: farm['name'] });
  }

  putVaccinesObservations(element: object) {
    return this.http.put(this.url + '/farm/' + this.idSelected + '/lots/vaccination_date/update', { id: element['id'], observations: element['observations'] });
  }

  updateSheds() {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/sheds');
  }

  updateWeight(id_lot: number, weight: number) {
    return this.http.put(this.url + '/farm/' + this.idSelected + '/weight/update', { weight, id_lot });
  }

  updateFoodConsum(selectedLot: any, amount: any, id_food: any) {
    return this.http.post(this.url + '/farm/' + this.idSelected + '/eating_history/' + selectedLot + '/add', { id_food, amount });
  }

  updateInfoUser(names: any, lastnames: any, phone: any) {
    return this.http.put(this.url + '/profile/' + this.infoUser[0]['idPerson'], { names, lastnames, phone });
  }

  addWeightHistory(id_lot: number, weight: number) {
    return this.http.post(this.url + '/farm/' + this.idSelected + '/weight/add', { weight, id_lot });
  }

  getFoodInventory() {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/food_inventory/');
  }

  getFoodConsumHistory(selectedLot: any) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/eating_history/' + selectedLot);
  }

  getUserWithSocialNetwork(email: string) {
    return this.http.post(this.url + '/forgotpass', { email });
  }

  getVaccinesHistory(selectedLot: any) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/lots/' + selectedLot + '/vaccination_date');
  }
  getFoodReport(initialDate, finalDate) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/report/dailyFood/' + initialDate + '/' + finalDate);
  }

  getTotalFoodLots(initialDate: string, finalDate: string) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/report/foodAll/' + initialDate + '/' + finalDate);
  }

  getWaterReport(initialDate, finalDate) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/report/dailyWater/' + initialDate + '/' + finalDate);
  }
  getTotalWaterLots(initialDate, finalDate) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/report/waterAll/' + initialDate + '/' + finalDate);
  }

  getMortalityReport(initialDate: any, finalDate: any) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/report/dailyDeath/' + initialDate + '/' + finalDate);
  }
  getTotalMortalityLots(initialDate: any, finalDate: any) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/report/deathAll/' + initialDate + '/' + finalDate);
  }

  getCostsReport(initialDate: any, finalDate: any) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/report/dailyCost/' + initialDate + '/' + finalDate);
  }
  getTotalCostsLots(initialDate: any, finalDate: any) {
    return this.http.get(this.url + '/farm/' + this.idSelected + '/report/costAll/' + initialDate + '/' + finalDate);
  }

  addNewFarm(name: string) {
    return this.http.post(this.url + '/add', { id: this.idUserActive, name });
  }

  updateQuantyFood(amount: any, id_food_Inventory: any) {
    return this.http.put(this.url + '/farm/' + this.idSelected + '/food_inventory', {
      amount,
      id_food_Inventory,
      id_user: this.idUserActive
    });
  }

  changePass(email: any, pass: any) {
    return this.http.put(this.url + '/changePass', { email, pass });
  }

  existFood(code: any) {
    return this.http.get(this.url + '/farm/foods/' + code);
  }

  createFood(id: any, name: any, mark: any, weight: any) {
    return this.http.post(this.url + '/farm/foods/add', { id, name, mark, weight });
  }

  addInventory(price: any, id_food: any, amount: any) {
    console.log('id_food')
    console.log(id_food)
    console.log('price')
    console.log(price)
    console.log('amount')
    console.log(amount)
    return this.http.post(this.url + '/farm/' + this.idSelected + '/food_inventory/add', { price, id_food, amount, id_user: this.infoUser[0]['id'] });
  }

}