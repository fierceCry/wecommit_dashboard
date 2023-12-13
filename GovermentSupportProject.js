class GovernmentSupportProject {
    constructor(
        title,
        supporttype,
        biztitle,
        viewcount,
        detailurl,
        postsn,
        posttarget,
        posttargetage,
        posttargetcomage,
        startdate,
        enddate,
        insertdate,
        blngGvdpCdNm,
        prchCnadrNo,
        areaname,
        sprvInstClssCdNm,
        bizPrchDprtNm,
        organizationname,
        agreement_start_date,
        agreement_end_date,
        agreement_duration,
        selected_cnt,
        maximum_amt,
        average_amt,
        self_funding_ratio,
        other_support_content,
        additional_points,
        document_url
    ){
        this.title = title;
        this.supporttype = supporttype;
        this.biztitle = biztitle;
        this.viewcount = viewcount;
        this.detailurl = detailurl;
        this.postsn = postsn;
        this.posttarget = posttarget;
        this.posttargetage = posttargetage;
        this.posttargetcomage = posttargetcomage;
        this.startdate = startdate;
        this.enddate = enddate;
        this.insertdate = insertdate;
        this.blngGvdpCdNm = blngGvdpCdNm;
        this.prchCnadrNo = prchCnadrNo;
        this.areaname = areaname;
        this.sprvInstClssCdNm = sprvInstClssCdNm;
        this.bizPrchDprtNm = bizPrchDprtNm;
        this.organizationname = organizationname;
        this.agreement_start_date = agreement_start_date;
        this.agreement_end_date = agreement_end_date;
        this.agreement_duration = agreement_duration;
        this.selected_cnt = selected_cnt;
        this.maximum_amt = maximum_amt;
        this.average_amt = average_amt;
        this.self_funding_ratio = self_funding_ratio;
        this.other_support_content = other_support_content;
        this.additional_points = additional_points;
        this.document_url = document_url;
    }    
}

module.exports = GovernmentSupportProject;
