export class User {
  public _id: string;
  public username: string;
  public password: string;
  public accessToken: string;
  public score: number;

  constructor() {}

  static create(data: any): User {
    const { username, password, accessToken, score, _id } = data;

    const instance  = new User();

    instance.username = username;
    instance.password = password;
    instance.accessToken = accessToken || '';
    instance.score = score || 0;
    instance._id = _id;

    return instance;
  }
}