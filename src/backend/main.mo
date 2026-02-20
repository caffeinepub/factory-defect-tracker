import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  type Department = {
    #cutting;
    #machining;
    #assembly;
    #painting;
    #embossing;
  };

  module Department {
    public func fromText(department : Text) : Department {
      switch (department) {
        case ("cutting") { #cutting };
        case ("machining") { #machining };
        case ("assembly") { #assembly };
        case ("painting") { #painting };
        case ("embossing") { #embossing };
        case (_) { Runtime.trap("Unknown department: " # department) };
      };
    };

    public func toText(department : Department) : Text {
      switch (department) {
        case (#cutting) { "cutting" };
        case (#machining) { "machining" };
        case (#assembly) { "assembly" };
        case (#painting) { "painting" };
        case (#embossing) { "embossing" };
      };
    };
  };

  type DefectReport = {
    id : Nat;
    productName : Text;
    department : Department;
    description : Text;
    photo : ?Storage.ExternalBlob;
    employeeId : Text;
    timestamp : Time.Time;
  };

  type DefectReportView = {
    id : Nat;
    productName : Text;
    department : Text;
    description : Text;
    photo : ?Storage.ExternalBlob;
    employeeId : Text;
    timestamp : Time.Time;
  };

  module DefectReportView {
    public func compare(report1 : DefectReportView, report2 : DefectReportView) : Order.Order {
      Int.compare(report1.timestamp, report2.timestamp);
    };
  };

  type NewDefectReport = {
    productName : Text;
    department : Text;
    description : Text;
    photo : ?Storage.ExternalBlob;
    employeeId : Text;
  };

  var reportCounter = 0;
  let defectReports = Map.empty<Nat, DefectReport>();

  public shared ({ caller }) func createDefectReport(report : NewDefectReport) : async Nat {
    let id = reportCounter;
    let department = Department.fromText(report.department);

    let newReport : DefectReport = {
      id;
      productName = report.productName;
      department;
      description = report.description;
      photo = report.photo;
      employeeId = report.employeeId;
      timestamp = Time.now();
    };

    defectReports.add(id, newReport);
    reportCounter += 1;
    id;
  };

  func toDefectReportView(report : DefectReport) : DefectReportView {
    {
      id = report.id;
      productName = report.productName;
      department = Department.toText(report.department);
      description = report.description;
      photo = report.photo;
      employeeId = report.employeeId;
      timestamp = report.timestamp;
    };
  };

  public query ({ caller }) func getAllReports() : async [DefectReportView] {
    defectReports.values().toArray().map(toDefectReportView).reverse();
  };

  public query ({ caller }) func getReportsByDepartment(departmentText : Text) : async [DefectReportView] {
    let department = Department.fromText(departmentText);
    defectReports.values().toArray().map(toDefectReportView).filter(
      func(report) {
        report.department == departmentText;
      }
    ).reverse();
  };

  public query ({ caller }) func getReportsByProduct(productName : Text) : async [DefectReportView] {
    let lowerProductName = productName.toLower();
    defectReports.values().toArray().map(toDefectReportView).filter(
      func(report) {
        report.productName.toLower().contains(#text lowerProductName);
      }
    ).reverse();
  };
};
