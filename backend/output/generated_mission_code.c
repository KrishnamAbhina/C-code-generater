#define ON 1
#define OFF 0
#define unsigned short int WORD
#define EXTERNVAR
#define LOCALVAR

#define BUS_0 0
#define SS3 3

/* Declare all required variables */
int event;
float time0;
float time_sepr;
float time2;
float time3;
float time4;
float time6;

float F;
float MODECODE;
float NAV2Cmd;
float P;
float h;
float h0;
float time1;
float timeFlight;
float time_start;
int Control;
int control;
int ctkl;
int obcStatus;

/* Function prototypes */
int condition1forEvent1(); // TODO: Define this function - currently only declared
int processDips1Event2(); // TODO: Define this function - currently only declared

/* Placeholder functions for condition checks */

/* condition1forEvent1
 * Purpose: Sensing Avg. |Axb|>14:892 (1.2)m/s2 over 4 consecutive samples @ 10
 */
int condition1forEvent1() {
    // Sensing Avg. |Axb|>14:892 (1.2)m/s2 over 4 consecutive samples @ 10
    // return 1;
}
/* processDips1Event2
 * Purpose: 3 consecutive samples @ 10 of DIP 00==1 & DIP 01==0 (OOC1) DIP 02==1 & DIP 03==0 (OOC2) DIP 04==1 & DIP 05==0 (OOC3) DIP 06==1 & DIP 07==0 (OOC4)
 */
bool processDips1Event2() {
    // 3 consecutive samples @ 10 of DIP 00==1 & DIP 01==0 (OOC1) DIP 02==1 & DIP 03==0 (OOC2) DIP 04==1 & DIP 05==0 (OOC3) DIP 06==1 & DIP 07==0 (OOC4)
    // return 1;
}

void interface() {
    // Control = external_Control;
    // F = external_F;
    // MODECODE = external_MODECODE;
    // NAV2Cmd = external_NAV2Cmd;
    // P = external_P;
    // control = external_control;
    // ctkl = external_ctkl;
    // h = external_h;
    // h0 = external_h0;
    // obcStatus = external_obcStatus;
    // time0 = external_time0;
    // time1 = external_time1;
    // time2 = external_time2;
    // time3 = external_time3;
    // timeFlight = external_timeFlight;
    // time_sepr = external_time_sepr;
    // time_start = external_time_start;
}

void init_timevar() {
    event = 1;
    timeFlight = 0.0;
    time0 = 0.0;
    time_sepr = 0.0;
    time2 = 0.0;
    time3 = 0.0;
    time4 = 0.0;
    time6 = 0.0;
}

#ifdef EXTERNVAR
extern float time_sepr;
extern float time_start;
extern float h0;
extern float time1;
extern float timeFlight;
extern float h;
extern float NAV2Cmd;
extern float time3;
extern float MODECODE;
extern float P;
extern float time0;
extern float F;
extern float time2;
extern int control;
extern int ctkl;
extern int Control;
extern int obcStatus;
#endif

void misSeq() {
    WORD dopNos[10];
    WORD dopValues[10];
    interface();

    switch(event) {

        /*
* Event Description: Sensing Avg. Axb > 14:892m/s2 over 4 consecutive samples @ 10
* ms
*/
        case 1:
                  control = 1;
        obcStatus = 0;
            if ((condition1forEvent1()) || (MODECODE==1 & NAV2Cmd==1)) {



                time0 = timeFlight;
                event = 1;
            }
            break;

        /*
* Event Description: Out-Off-Canister is sensed by 4 OOC sensors and declared
* using 2/4 logic by OBC. h0 is the Lift off height.
*/
        case 2:
          
            if ((((timeFlight>=(time0 + 0.900)) && (processDips1Event2())) && ((h - h0)>=20)) || (((MODECODE==1) && (timeFlight>(time_sepr + 2.000))) && ((F>60) || (P<60)))) {



                time_sepr = timeFlight;
                event = 2;
            }
            break;

        /*
* Event Description:
*/
        case 3:
                  ctkl = 1;
            if (timeFlight>=(time1 + 0.600)) {

                dopValues[0] = A10;  
                dopValues[1] = A9;  
                dopValues[2] = B12;  
                dopValues[3] = B13;  
                misSeqDop(BUS_0, SS3, 4, dopNos, ON);
                time2 = timeFlight;
                event = 3;
            }
            break;

        /*
* Event Description:
*/
        case 4:
          
            if (timeFlight>=(time2 + 0.010)) {

                dopValues[0] = A10;  
                dopValues[1] = A9;  
                dopValues[2] = B12;  
                dopValues[3] = B13;  
                misSeqDop(BUS_0, SS3, 4, dopNos, ON);
                time3 = timeFlight;
                event = 4;
            }
            break;

        /*
* Event Description:
*/
        case 5:
          
            if (timeFlight>=(time3 + 0.180)) {

                dopValues[0] = A10;  
                dopValues[1] = A9;  
                dopValues[2] = B12;  
                dopValues[3] = B13;  
                misSeqDop(BUS_0, SS3, 4, dopNos, ON);
                time4 = timeFlight;
                event = 5;
            }
            break;

        /*
* Event Description:
*/
        case 6:
          
            if (timeFlight>time_start) {
                Control = 1;


                time6 = timeFlight;
                event = 6;
            }
            break;
        default:
            break;
    }
}