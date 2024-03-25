import { DataTypes, Model } from 'sequelize'
import database from '../config/database'

/**
 * The Email model
 */
class Email extends Model {
  public id!: string
  public user_id!: string
  public sent_date!: Date
  public email_type!: string
  public auth_token?: string
  public metadata?: object | string
  public email_created!: Date
  public email_updated!: Date
}

Email.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    sent_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    email_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    auth_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    sequelize: database.getDatabaseConnection(),
    modelName: 'Email',
    tableName: 'Email',
    timestamps: true,
    createdAt: 'email_created',
    updatedAt: 'email_updated'
  }
)

export default Email
