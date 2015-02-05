
// Answers need to be duplicated, so that the positive and the negatie effect
// is counted. Negative is 10-positive. All '?'= unknown are translated to 0 effect for
// both negative and positive

function pos_neg_array ( questions ) {

  var len = questions.length;

  var posneg =  questions.concat (questions);
  //console.log("posneg is: " + posneg);

  var i=0;

  for (i=0; i<len; i++) {
     switch (posneg[i]) { 
        case  '?': posneg[i] = 0; break;
        case  '1': posneg[i] = 1; break;
        case  '2': posneg[i] = 2; break;
	case  '3': posneg[i] = 3; break;
	case  '4': posneg[i] = 4; break;
	case  '5': posneg[i] = 5; break;
	case  '6': posneg[i] = 6; break;
	case  '7': posneg[i] = 7; break;
	case  '8': posneg[i] = 8; break;
	case  '9': posneg[i] = 9; break;
	case  '10': posneg[i] = 10; break;
     } 
  }

  for (i=len; i<len*2; i++) {
     switch (posneg[i]) { 
        case  '?': posneg[i] = 0; break;
        case  '1': posneg[i] = 9; break;
        case  '2': posneg[i] = 8; break;
	case  '3': posneg[i] = 7; break;
  	case  '4': posneg[i] = 6; break;
  	case  '5': posneg[i] = 5; break;
  	case  '6': posneg[i] = 4; break;
  	case  '7': posneg[i] = 3; break;
  	case  '8': posneg[i] = 2; break;
  	case  '9': posneg[i] = 1; break;
  	case  '10': posneg[i] = 0; break;
     }
  }
  
  return posneg;
}

// Create the model (symptom and remedy matrix)
require('sylvester');
var model_data = require('./model_data.js');
var symptom_matrix = $M (model_data.symptom_factors); // 38 columns (dimensions) * 556 rows (sympotoms*2)
var symptom_weight_vector = $V (model_data.symptom_weights); // 556 rows
var remedy_matrix = $M (model_data.remedy_factors); // 38 columns, 398 rows (remedies)

// transpose both matrices (this is needed below, but really needs to be done only once)
var symptom_matrix_transposed = symptom_matrix.transpose() ; 
var remedy_matrix_transposed =  remedy_matrix.transpose() ; 

var vect_mean = function (vector) {
        var n = vector.cols();
        var sum = 0;
        vector.each ( function (element) {
            sum += element;
        });
        return sum/n;
  };



function find_remedies (questions, doLog ) {

   if (doLog)  console.log("finding remedy for question with " + questions.length + " items" );

   // 1. Create Question Input Matrix
   var input = pos_neg_array(questions);
   var input_vector = $V (input);
   var weighted_input_vector = input_vector.elementDivide(symptom_weight_vector);
   if (doLog) console.log("weighted input: r:" + weighted_input_vector.rows() + " c: " + weighted_input_vector.cols() );
   //weighted_input_vector.each ( function (el) { console.log( el); } );


   // 2. Calculate Profile (a Vector with the patients 38 dimensions)
   // Muliply matrices

   if (doLog)console.log("symptom matrix: r: " + symptom_matrix.rows() + " c:"+ symptom_matrix.cols() + " input: c:" + weighted_input_vector.cols() );

   var profile = symptom_matrix_transposed.multiply (weighted_input_vector);
   if (profile==null) {
      console.log("profile vector is null.");
   }
   else {
     // profile is a vector!
     if (doLog) console.log("profile vector: r:" + profile.rows() + " c: " + profile.cols() );
     if (doLog) console.log("profile max: " + profile.max() );
     if (doLog) console.log("profile: " + profile.inspect() );
     //profile.each ( function (el) { console.log( el); } );

     var mean = vect_mean(profile);
     var norm = profile.norm();
     if (doLog) console.log("profile mean: " + mean );
     if (doLog) console.log("profile stddev: " + norm  );

     var profile_minus_mean = profile.add (-mean);
     var profile_normalized = profile.multiply (1/norm);
     if (doLog) console.log("profile normalized: " + profile_normalized.inspect() );


     var remedy_correlation = remedy_matrix.multiply (profile_normalized);
     if (doLog) console.log("***");
     if (doLog)console.log("***");
     if (doLog)     console.log("***");
     if (doLog)     console.log("***");
     if (doLog)     console.log("remedy correlation: " + remedy_correlation.inspect() );

     var foundremedies = $M (remedy_correlation); //  ();
//     remedy_correlation_matrix.setElements (remedy_correlation);
     var remedy_array = foundremedies.toArray();

     if (doLog) console.log("as array: " + remedy_array);

     var remedies_search = [];
     for (var i=0; i < remedy_array.length; i++) {
	var r = { number:model_data.remedies[i].number, name:model_data.remedies[i].name, data:Math.round (remedy_array[i]*100) };
        remedies_search.push(r);
     }
     if (doLog) console.log("searchable remedies: " + remedies_search);

     remedies_search.sort(function(a, b){
       var av=a.data, bv=b.data;
       return bv-av; //sort descending
     });


     return remedies_search;
   }


}


// Test the normalization function
console.log("TEST for Input Preprocessing..");
var demo = [ '?', '1', '2', '3', '4', '5', '6', '7', '8', '9','10'];
var input_demo = pos_neg_array (demo);
console.log("preprocessed demo question is: " + input_demo);



// export it, so that it works as a module
module.exports.find_remedies = find_remedies ;