import { Entity, BaseEntity, PrimaryColumn, Column, OneToMany, ManyToOne, Relation } from 'typeorm';

/** Represents a Helm Chart */
@Entity("Charts")
export class Chart extends BaseEntity {
    /** The unique ID of the Helm Chart */
    @PrimaryColumn()
    id!: string;

    /** When the Helm Chart was pushed/created */
    @Column()
    created!: Date;
    
    /** The user that pushed the Helm Chart (operator from Harbor webhook) */
    @Column()
    user!: string;

    /** Helm Chart Name */
    @Column()
    name!: string;
    
    /** Helm chart digest */
    @Column()
    digest!: string;

    /** Helm chart tag */
    @Column()
    tag!: string;
    
    /** Helm Chart URL */
    @Column()
    url!: string;
}