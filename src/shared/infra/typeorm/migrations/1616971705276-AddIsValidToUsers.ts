import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AddIsValidToUsers1616971705276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'isValid',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'isValid')
  }
}
