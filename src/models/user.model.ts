import { DataTypes, Model } from 'sequelize'
import database from '../config/database'

/**
 * The User model
 */
class User extends Model {
  public id!: string
  public first_name!: string
  public last_name!: string
  public username!: string
  public password!: string
  public email_verified: boolean
  public account_created!: Date
  public account_updated!: Date

  toJSON(): object {
    const dtoKeys = new Set(['id', 'first_name', 'last_name', 'username', 'account_created', 'account_updated'])
    const values: Record<string, unknown> = {}
    for (const key in this.get()) {
      if (dtoKeys.has(key)) values[key] = this.get(key)
    }
    return values
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    sequelize: database.getDatabaseConnection(),
    modelName: 'User',
    tableName: 'User',
    timestamps: true,
    createdAt: 'account_created',
    updatedAt: 'account_updated',
    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['password']
        }
      }
    }
  }
)

export default User
