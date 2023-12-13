const EntitySchema = require("typeorm").EntitySchema;
const  GovernmentSupportProject  = require("./GovermentSupportProject");

module.exports = new EntitySchema({
    name: "government_support_project",
    target: GovernmentSupportProject,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        title: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        supporttype: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        biztitle: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        viewcount: {
            type: "int",
            nullable: false, // NOT NULL
        },
        detailurl: {
            type: "longtext",
            nullable: false, // NOT NULL
        },
        postsn: {
            type: "int",
            nullable: false, // NOT NULL
        },
        posttarget: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        posttargetage: {
            type: "varchar",
            nullable: false, // NOT NULL
        },
        posttargetcomage: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        startdate: {
            type: "datetime",
            nullable: false, // NOT NULL
        },
        enddate: {
            type: "datetime",
            nullable: false, // NOT NULL
        },
        insertdate: {
            type: "datetime",
            nullable: false, // NOT NULL
        },
        blngGvdpCdNm: {
            type: "varchar",
            length: 500, 
            nullable: true, // null 허용
        },
        prchCnadrNo: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        areaname: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        sprvInstClssCdNm: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        bizPrchDprtNm: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        organizationname: {
            type: "varchar",
            length: 500, 
            nullable: false, // NOT NULL
        },
        agreement_start_date: {
            type: "datetime",
            nullable: true, // null 허용
        },
        agreement_end_date: {
            type: "datetime",
            nullable: true, // null 허용
        },
        agreement_duration: {
            type: "varchar",
            length: 500, 
            nullable: true, // null 허용
        },
        selected_cnt: {
            type: "varchar",
            nullable: true, // null 허용
        },
        maximum_amt: {
            type: "varchar",
            length: 500, 
            nullable: true, // null 허용
        },
        average_amt: {
            type: "varchar",
            length: 500, 
            nullable: true, // null 허용
        },
        self_funding_ratio: {
            type: "varchar",
            length: 500, 
            nullable: true, // null 허용
        },
        other_support_content: {
            type: "varchar",
            length: 500, 
            nullable: true, // null 허용
        },
        additional_points: {
            type: "varchar",
            length: 500, 
            nullable: true, // null 허용
        },
        document_url: {
            type: "longtext",
            nullable: true, // null 허용
        }
    },
});
